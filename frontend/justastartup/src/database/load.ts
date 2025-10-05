import { supabase } from './supaBaseClient';

export interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface LoadResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Load user's projects from the database
 * @param userId - The user ID to filter projects by
 * @param tableName - The table name to query from ('projects' or 'startups')
 * @returns Promise with projects data, error, and loading state
 */
export const loadUserProjects = async (
  userId: string, 
  tableName: 'projects' | 'startups' = 'projects'
): Promise<LoadResult<Project[]>> => {
  try {
    console.log(`Loading projects from ${tableName} table for user:`, userId);
    console.log(`Query: SELECT * FROM ${tableName} WHERE id = '${userId}'`);

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    console.log(`Raw query result:`, { data, error });
    
    if (error) {
      console.error(`Error fetching projects from ${tableName}:`, error);
      
      // Handle table not existing gracefully
      if (error.message.includes(`relation "public.${tableName}" does not exist`) || 
          error.code === 'PGRST116' || 
          error.message.includes('404')) {
        console.log(`${tableName} table does not exist yet, returning empty array`);
        return {
          data: [],
          error: null,
          loading: false
        };
      }
      
      return {
        data: null,
        error: `Failed to load projects: ${error.message}`,
        loading: false
      };
    }

    console.log(`Successfully loaded ${data?.length || 0} projects from ${tableName}`);
    console.log(`Projects data:`, data);
    return {
      data: data || [],
      error: null,
      loading: false
    };

  } catch (err) {
    console.error('Unexpected error loading projects:', err);
    return {
      data: [],
      error: null, // For network errors, show empty state instead of error
      loading: false
    };
  }
};

/**
 * Load a single project by ID
 * @param projectId - The project ID to load
 * @param tableName - The table name to query from ('projects' or 'startups')
 * @returns Promise with project data, error, and loading state
 */
export const loadProject = async (
  projectId: string,
  tableName: 'projects' | 'startups' = 'projects'
): Promise<LoadResult<Project>> => {
  try {
    console.log(`Loading project ${projectId} from ${tableName} table`);

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('id', projectId)
      .single();

    if (error) {
      console.error(`Error fetching project from ${tableName}:`, error);
      return {
        data: null,
        error: `Failed to load project: ${error.message}`,
        loading: false
      };
    }

    console.log(`Successfully loaded project from ${tableName}:`, data);
    return {
      data: data,
      error: null,
      loading: false
    };

  } catch (err) {
    console.error('Unexpected error loading project:', err);
    return {
      data: null,
      error: 'Failed to load project',
      loading: false
    };
  }
};

/**
 * Get the current authenticated user's session
 * @returns Promise with session data or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    return session;
  } catch (err) {
    console.error('Unexpected error getting session:', err);
    return null;
  }
};

/**
 * Load projects for the currently authenticated user
 * @param tableName - The table name to query from ('projects' or 'startups')
 * @returns Promise with projects data, error, and loading state
 */
export const loadCurrentUserProjects = async (
  tableName: 'projects' | 'startups' = 'projects'
): Promise<LoadResult<Project[]>> => {
  try {
    const session = await getCurrentUser();
    
    if (!session?.user) {
      return {
        data: null,
        error: 'User not authenticated',
        loading: false
      };
    }
    
    return await loadUserProjects(session.user.id, tableName);
  } catch (err) {
    console.error('Error loading current user projects:', err);
    return {
      data: null,
      error: 'Failed to load projects',
      loading: false
    };
  }
};

/**
 * Set up real-time subscription for user's projects
 * @param userId - The user ID to filter projects by
 * @param tableName - The table name to subscribe to ('projects' or 'startups')
 * @param onUpdate - Callback function to handle real-time updates
 * @returns Subscription object that can be used to unsubscribe
 */
export const subscribeToUserProjects = (
  userId: string,
  tableName: 'projects' | 'startups' = 'projects',
  onUpdate: (payload: any) => void
) => {
  console.log(`Setting up real-time subscription for ${tableName} table, user:`, userId);
  
  const subscription = supabase
    .channel(`${tableName}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        console.log(`Real-time change in ${tableName}:`, payload);
        onUpdate(payload);
      }
    )
    .subscribe();

  return subscription;
};

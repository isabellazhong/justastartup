import { supabase } from '../database/supaBaseClient';

export async function addProjectToStartups(project: { name: string; description: string }) {
  try {
    // Get the current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    console.log('Adding project for user:', user.id);

    const { data, error } = await supabase
      .from('startups')
      .insert([
        {
          name: project.name,
          description: project.description,
          user_id: user.id, // Add the current user's ID
        }
      ])
      .select();

    if (error) {
      console.error('Error inserting project:', error);
      throw error;
    }

    console.log('Project successfully added:', data);
    return data;
  } catch (error) {
    console.error('Error in addProjectToStartups:', error);
    throw error;
  }
}
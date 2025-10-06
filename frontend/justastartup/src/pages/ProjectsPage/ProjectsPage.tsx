import './ProjectsPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthNavbar } from '../../components';
import { supabase } from '../../database/supaBaseClient';
import { useState, useEffect } from 'react';
import type { Project } from '../../database/load';
import { 
  loadCurrentUserProjects, 
  subscribeToUserProjects, 
  getCurrentUser 
} from '../../database/load';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  useEffect(() => {
    let realtimeSubscription: any = null;

    const initializeProjects = async () => {
      try {
        // Get initial session and load projects
        const session = await getCurrentUser();
        
        if (session?.user) {
          await loadProjects();
          
          // Set up real-time subscription
          realtimeSubscription = subscribeToUserProjects(
            session.user.id,
            'startups', // Using startups table
            () => {
              console.log('Projects updated, reloading...');
              loadProjects();
            }
          );
        } else {
          setLoading(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error initializing projects:', error);
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadProjects();
        
        // Clean up old subscription
        if (realtimeSubscription) {
          supabase.removeChannel(realtimeSubscription);
        }
        
        // Set up new subscription
        realtimeSubscription = subscribeToUserProjects(
          session.user.id,
          'startups', // Using startups table
          () => {
            console.log('Projects updated, reloading...');
            loadProjects();
          }
        );
      } else {
        if (realtimeSubscription) {
          supabase.removeChannel(realtimeSubscription);
        }
        navigate('/login');
      }
    });

    // Initialize on component mount
    initializeProjects();

    return () => {
      subscription.unsubscribe();
      if (realtimeSubscription) {
        supabase.removeChannel(realtimeSubscription);
      }
    };
  }, [navigate]);

  // Load projects using the centralized load method
  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await loadCurrentUserProjects('startups'); // Using startups table
      
      if (result.error) {
        setError(result.error);
        setProjects([]);
      } else {
        setProjects(result.data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error in loadProjects:', err);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project: Project) => {
    const params = new URLSearchParams();
    if (project.name) params.set('name', project.name);
    if ((project as any).idea || (project as any).description) {
      const idea = (project as any).idea || (project as any).description || '';
      params.set('idea', idea);
    }
    navigate(`/analytics?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <AuthNavbar />
        <main className="flex-1 w-full">
          <div className="projects-page">
            <div className="projects-content">
              <div className="projects-hero">
                <h1>Your Projects</h1>
                <p className="hero-subtitle">Loading your projects...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <AuthNavbar />
        <main className="flex-1 w-full">
          <div className="projects-page">
            <div className="projects-content">
              <div className="projects-hero">
                <h1>Your Projects</h1>
                <p className="hero-subtitle error">{error}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <AuthNavbar />
      <main className="flex-1 w-full">
        <div className="projects-page">
          <div className="projects-content">
            <div className="projects-hero">
              <h1>Your Projects</h1>
              <p className="hero-subtitle">
                {projects.length === 0 
                  ? "Start your entrepreneurial journey by creating your first project." 
                  : `You have ${projects.length} project${projects.length === 1 ? '' : 's'}`
                }
              </p>
            </div>

            <div className="projects-grid">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="project-card"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="project-icon">🚀</div>
                  <h3 className="project-title">{project.name}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-date">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Create new project card */}
              <div 
                className="project-card create-card"
                onClick={handleCreateProject}
              >
                <div className="project-icon create-icon">+</div>
                <h3 className="project-title">Create New Project</h3>
                <p className="project-description">Start analyzing a new startup idea</p>
              </div>
            </div>

            {projects.length === 0 && !error && (
              <div className="empty-state">
                <div className="empty-icon">💡</div>
                <h3>Ready to start?</h3>
                <p>Create your first project to get started with market analysis and insights. Your projects will be saved and displayed here once you create them.</p>
                <button className="create-first-btn" onClick={handleCreateProject}>
                  Create Your First Project
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

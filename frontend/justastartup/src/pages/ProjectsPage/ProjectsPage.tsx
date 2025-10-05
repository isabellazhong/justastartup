import './ProjectsPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthNavbar } from '../../components';
import { supabase } from '../../database/supaBaseClient';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = () => {
    navigate('/create-project');
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        fetchProjects(session.user.id);
      } else {
        setLoading(false);
        navigate('/login');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        fetchProjects(session.user.id);
      } else {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProjects = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        // If the table doesn't exist (404 error), treat it as no projects
        if (error.message.includes('relation "public.projects" does not exist') || 
            error.code === 'PGRST116' || 
            error.message.includes('404')) {
          console.log('Projects table does not exist yet, showing empty state');
          setProjects([]);
          setError(null);
        } else {
          setError('Failed to load projects');
        }
      } else {
        setProjects(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      // For network errors or table not found, show empty state
      setProjects([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
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
                  onClick={() => handleProjectClick(project.id)}
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

import { useNavigate } from 'react-router-dom';
import CreateProject from '../../components/CreateProject/CreateProject';
import { AuthNavbar } from '../../components';
import { addProjectToStartups } from '../../database/add';
import { supabase } from '../../database/supaBaseClient';
import { useEffect, useState } from 'react';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current user session
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error getting user:', error);
          navigate('/login');
          return;
        }
        
        if (user) {
          setUserId(user.id);
        } else {
          navigate('/login');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setLoading(false);
      } else {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleProjectSubmit = async (projectData: { name: string; description: string }) => {
    if (!userId) {
      console.error('No user ID available');
      return;
    }

    try {
      const projectWithUserId = {
        ...projectData,
        user_id: userId
      };
      
      console.log('Project created:', projectWithUserId);
      await addProjectToStartups(projectWithUserId);
      
      // Redirect to projects after creation
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
    } catch (error) {
      console.error('Error creating project:', error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col">
        <AuthNavbar />
        <main className="flex-1 w-full flex items-center justify-center bg-gray-50">
          <div className="w-full max-w-md text-center">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <main className="flex-1 w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <CreateProject onSubmit={handleProjectSubmit} />
        </div>
      </main>
    </div>
  );
}
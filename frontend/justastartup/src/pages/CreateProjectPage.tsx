import { useNavigate } from 'react-router-dom';
import CreateProject from '../components/CreateProject/CreateProject';
import { Navbar05 } from '@/components/ui/shadcn-io/navbar-05';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const handleProjectSubmit = (projectData: { name: string; description: string }) => {
    console.log('Project created:', projectData);
    // Here you can add logic to save to database
    // For now, redirect to home after creation
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar05 />
      <main className="flex-1 w-full flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md">
          <CreateProject onSubmit={handleProjectSubmit} />
        </div>
      </main>
    </div>
  );
}
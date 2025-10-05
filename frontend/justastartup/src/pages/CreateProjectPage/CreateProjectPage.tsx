import { useNavigate } from 'react-router-dom';
import CreateProject from '../../components/CreateProject/CreateProject';
import { AuthNavbar } from '../../components';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const handleProjectSubmit = (projectData: { name: string; description: string }) => {
    console.log('Project created:', projectData);
    // Here you can add logic to save to database
    // For now, redirect to projects after creation
    setTimeout(() => {
      const params = new URLSearchParams();
      params.set('name', projectData.name);
      params.set('idea', projectData.description);
      navigate(`/analytics?${params.toString()}`);
    }, 2000);
  };

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
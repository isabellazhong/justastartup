import { useNavigate } from 'react-router-dom';
import CreateProject from '../components/CreateProject/CreateProject';
import './Pages.css';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const handleProjectSubmit = (projectData: { name: string; description: string }) => {
    console.log('Project created:', projectData);
    // Here you can add logic to save to database
    // Navigate to analytics dashboard with the project data
    setTimeout(() => {
      navigate('/analytics', { state: { projectData } });
    }, 2000);
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1>Justastartup</h1>
      </header>
      
      <main className="page-content">
        <CreateProject onSubmit={handleProjectSubmit} />
      </main>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrendsChart } from '../components';
import './Pages.css';

export default function AnalyticsDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for project data
  const [projectData, setProjectData] = useState({
    name: '',
    description: ''
  });
  
  // Check if we have project data from navigation state
  useEffect(() => {
    if (location.state && location.state.projectData) {
      setProjectData(location.state.projectData);
    }
  }, [location]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The TrendsChart will automatically update when projectData changes
  };
  
  return (
    <div className="page-container">
      <header className="page-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Back to Home
        </button>
        <h1>Analytics Dashboard</h1>
        <button onClick={() => navigate('/create-project')} className="action-button">
          New Project
        </button>
      </header>
      
      <main className="page-content analytics-content">
        <section className="project-info-section">
          <h2>Project Information</h2>
          <form onSubmit={handleSubmit} className="project-info-form">
            <div className="form-group">
              <label htmlFor="name">Project Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={projectData.name}
                onChange={handleInputChange}
                placeholder="Enter project name"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Project Description</label>
              <textarea
                id="description"
                name="description"
                value={projectData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows={3}
                required
              />
            </div>
            
            <button type="submit">Update Analytics</button>
          </form>
        </section>
        
        <section className="analytics-section">
          <h2>Market Trends Analysis</h2>
          <div className="trends-chart-wrapper">
            {projectData.name && projectData.description ? (
              <TrendsChart 
                name={projectData.name} 
                idea={projectData.description} 
              />
            ) : (
              <div className="chart-placeholder">
                <p>Enter project details to view trend analysis</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
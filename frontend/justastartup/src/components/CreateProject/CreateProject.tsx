import { useState } from 'react';
import './CreateProject.css';
import '../../pages/Pages.css';

interface CreateProjectProps {
  onSubmit?: (projectData: { name: string; description: string }) => void;
}

export default function CreateProject({ onSubmit }: CreateProjectProps) {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (projectName.trim() && description.trim()) {
      if (onSubmit) {
        onSubmit({ name: projectName, description });
      }
      setShowPopup(true);
    }
  };

  return (
    <div className="create-project-form">
      <h2>Create New Project</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter project description"
            rows={4}
            required
          />
        </div>
        
        <button type="submit">Create Project</button>
      </form>

      {showPopup && (
        <div className="popup">
          <h3>Project Created Successfully!</h3>
          <p><strong>Name:</strong> {projectName}</p>
          <p><strong>Description:</strong> {description}</p>
          <button onClick={() => setShowPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

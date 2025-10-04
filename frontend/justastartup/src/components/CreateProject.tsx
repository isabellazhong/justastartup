import { useState } from 'react'
import './CreateProject.css'

export default function CreateProject() {
  const [showPopup, setShowPopup] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Project created:', { projectName, description })
    // Add your project creation logic here
    setShowPopup(false)
    setProjectName('')
    setDescription('')
  }

  return (
    <div className="create-project-container">
      <div className="new-project-box">
        <button 
          className="create-project-btn"
          onClick={() => setShowPopup(true)}
        >
          Create New Project
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="project-popup" onClick={(e) => e.stopPropagation()}>
            <h2>New Project</h2>
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
                  placeholder="Describe your idea"
                  rows={4}
                  required
                />
              </div>
              <div className="button-group">
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
                <button type="submit">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
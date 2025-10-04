import { useState } from 'react'
import './App.css'
import {Dashboard, CreateProject} from './components';


function App() {
  const [showCreateProject, setShowCreateProject] = useState(false)

  if (showCreateProject) {
    return <CreateProject />
  }

  return <Dashboard onGetStarted={() => setShowCreateProject(true)} />
}

export default App
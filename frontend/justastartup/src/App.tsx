import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import AboutPage from './pages/AboutPage/AboutPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import SelectPage from './pages/SelectPage/SelectPage';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/about' element={<AboutPage/>} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/select" element={<SelectPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
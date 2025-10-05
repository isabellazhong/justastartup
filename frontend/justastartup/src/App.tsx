import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import CreateProjectPage from './pages/CreateProjectPage';
import AnalyticsDashboardPage from './pages/AnalyticsDashboardPage';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/analytics" element={<AnalyticsDashboardPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
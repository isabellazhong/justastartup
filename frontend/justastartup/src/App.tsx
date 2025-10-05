import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/HomePage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import AboutPage from './pages/AboutPage/AboutPage';

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectPage />} />
          <Route path="/login" element={<Login />} />
          <Route path='/about' element={<AboutPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
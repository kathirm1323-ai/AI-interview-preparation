import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { InterviewProvider } from './context/InterviewContext';
import HomePage from './pages/HomePage';
import ResumePage from './pages/ResumePage';
import InterviewPage from './pages/InterviewPage';
import ReportPage from './pages/ReportPage';
import HistoryPage from './pages/HistoryPage';
import './index.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="logo">🎤</div>
          <span>InterviewAI</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>🏠 <span>Home</span></NavLink>
          <NavLink to="/resume" className={({ isActive }) => isActive ? 'active' : ''}>📄 <span>Resume</span></NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>📊 <span>History</span></NavLink>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <InterviewProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </InterviewProvider>
  );
}

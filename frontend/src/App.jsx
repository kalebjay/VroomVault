import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import MaintenancePage from './pages/MaintenancePage';
import VehiclesPage from './pages/VehiclesPage';  

// Start a local frontend react app 
// on port 5173 using cmd 'npm run dev'
// alias npmr='npm run dev'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/vehicles" element={<VehiclesPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

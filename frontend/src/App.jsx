import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import MaintenancePage from './pages/MaintenancePage';
import VehiclesPage from './pages/VehiclesPage';  

import { useAuth } from './utils/AuthContext';

// Start a local frontend react app 
// on port 5173 using cmd 'npm run dev'
// alias npmr='npm run dev'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // You can add a loading spinner here
    return <div>Loading...</div>;
  }
  
  return user?.loggedIn ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/vehicles" element={<ProtectedRoute><VehiclesPage /></ProtectedRoute>} />
          <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
          <Route path="/test" element={<ProtectedRoute><TestPage /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

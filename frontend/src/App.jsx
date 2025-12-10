import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import MaintenancePage from './pages/MaintenancePage';
import VehiclesPage from './pages/VehiclesPage';  

// Start a local frontend react app 
// on port 5173 using cmd 'npm run dev'
// alias npmr='npm run dev'

const useAuth = () => {
  // TODO - check for a valid token in localStorage or a global state
  const user = { loggedIn: true }; // TEMPORARY: Set to true for development
  return user && user.loggedIn;
};

const ProtectedRoute = ({ children }) => {
  const isAuth = useAuth();
  return isAuth ? children : <Navigate to="/login" />;
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

import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Check for a token on initial load
    const token = localStorage.getItem('authToken');
    if (token) {
      // Here you might want to verify the token with the backend
      // For now, we'll assume if a token exists, the user is logged in.
      // A better approach is to have a /me or /verify-token endpoint.
      setUser({ loggedIn: true }); // Or set user details from token
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, userDetails } = response.data; // Adjust based on your API response
      localStorage.setItem('authToken', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ loggedIn: true, ...userDetails });
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login errors (e.g., show a message to the user)
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = { user, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};







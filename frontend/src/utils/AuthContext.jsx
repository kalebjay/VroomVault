import { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle initial auth check

  useEffect(() => {
    // Check for a token on initial load
    const token = localStorage.getItem('authToken');
    if (token) {
      // If a token exists, set the auth header for all subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Decode the token to get user details
      const decodedToken = jwtDecode(token);
      // The 'sub' claim in a JWT typically holds the subject (username in this case)
      setUser({ loggedIn: true, username: decodedToken.sub, id: decodedToken.id });
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // FastAPI's OAuth2PasswordRequestForm expects form data
      const form = new URLSearchParams();
      form.append('username', credentials.username);
      form.append('password', credentials.password);

      const response = await apiClient.post('/auth/login', form, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, user_id, username } = response.data;
      localStorage.setItem('authToken', access_token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser({ loggedIn: true, id: user_id, username: username });
    } catch (error) {
      // Clear any stale auth data on login failure
      logout();
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

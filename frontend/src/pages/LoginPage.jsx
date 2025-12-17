import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Pages.module.css';

//
const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(''); // For registration
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is authenticated and not in the middle of a login attempt,
    // navigate to the home page.
    if (user?.loggedIn && !loading) {
      navigate('/');
    }
  }, [user, navigate, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        await login({ username, password });
        // On successful login, the useEffect will handle the navigation.
      } else {
        // Handle registration
        await apiClient.post('/users', { username, email, password });
        // After successful registration, automatically log the user in
        await login({ username, password });
      }
    } catch (err) {
      if (isLoginMode) {
        setError('Failed to log in. Please check your credentials.');
      } else {
        // More specific error handling could be added here based on API responses
        setError('Registration failed. The username or email may already be taken.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(''); // Clear errors when switching modes
  };
  
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>{isLoginMode ? 'Login' : 'Create Account'}</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        {!isLoginMode && (
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        )}
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Create Account')}
        </button>
        <div className={styles.formFooter}>
          <button type="button" onClick={toggleMode} className={styles.linkButton}>
            {isLoginMode ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </form>
    </div>    
  );
};
      
export default LoginPage;
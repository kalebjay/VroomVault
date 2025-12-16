import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Pages.module.css';

//
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      await login({ username, password });
      // On successful login, the useEffect will handle the navigation.
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2 className={styles.title}>Login / New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username or Email:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </form>
    </div>    
  );
};
      
export default LoginPage;
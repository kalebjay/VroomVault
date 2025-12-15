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
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is successfully authenticated, navigate to the vehicles page.
    if (user?.loggedIn) {
      navigate('/vehicles');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username, password });
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
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
        <button type="submit">Login</button>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </form>
    </div>    
  );
};
      
export default LoginPage;
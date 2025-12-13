import React from 'react';
import { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Pages.module.css';

//
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/vehicles'); // Redirect to a protected page on success
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };
  
  return (
    <div>
      <h2 className={styles.title}>Login / New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
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
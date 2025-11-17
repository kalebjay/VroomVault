import React from 'react';
import { Link } from 'react-router-dom';
import styles from './LoginPage.module.css';


function LoginPage() {
  return (
    <div>
      <h1 className={styles.title}>Login / New User</h1>
      <p>Your login form and logic will go here.</p>
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default LoginPage;
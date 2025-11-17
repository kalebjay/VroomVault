import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HomePage.module.css';

function HomePage() {
  return (
    <>
      <Link to="/login" className={styles.loginButton}>New User/Login</Link>
      <div>
        <h1 className={styles.title}>Vroom Vault</h1>
        <h2>This is your ultimate auto hub!</h2>
      </div>
      <p>Track all of your vehicles and toys all in one place!</p>
      <Link to="/test" className={styles.testButton}>Test</Link>
    </>
  );
}

export default HomePage;
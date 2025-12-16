import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import styles from './Pages.module.css';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.pageContainer}>
      {user?.loggedIn ? (
        // Content for logged-in users
        <div>
          <h1 className={styles.title}>Welcome back, {user.username}!</h1>
          <p>Manage your vehicles and maintenance records with ease.</p>
          <div className={styles.buttonGroup}>
            <Link to="/vehicles" className={styles.button}>My Vehicles</Link>
            <button onClick={logout} className={`${styles.button} ${styles.logoutButton}`}>Logout</button>
          </div>
        </div>
      ) : (
        // Content for logged-out (guest) users
        <div>
          <h1 className={styles.title}>Welcome to VroomVault</h1>
          <p>Your personal garage in the cloud. Log in to manage your vehicles.</p>
          <Link to="/login" className={styles.button}>Login / Register</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
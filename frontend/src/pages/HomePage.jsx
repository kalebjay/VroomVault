import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaWrench, FaUser } from 'react-icons/fa';
import styles from './Pages.module.css';
import { useAuth } from '../utils/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to VroomVault</h1>
        <p className={styles.heroSubtitle}>Your digital garage for total vehicle care. Never miss a service again.</p>
        {user?.loggedIn ? (
          <div className={styles.heroActions}>
            <button onClick={logout} className={styles.logoutButton}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className={styles.ctaButton}>Get Started</Link>
        )}
      </header>

      {user?.loggedIn && (
        <section className={styles.featuresGrid}>
          <Link to="/vehicles" className={styles.featureCard}>
            <FaCar size={40} />
            <h2>My Vehicles</h2>
            <p>Track all your vehicles and their maintenance records in one place.</p>
          </Link>

          <Link to="/profiles" className={styles.featureCard}>
            <FaUser size={40} />
            <h2>Your Profile</h2>
            <p>Manage your account and preferences.</p>
          </Link>
        </section>
      )}

      <footer className={styles.homeFooter}>
        <p>&copy; {new Date().getFullYear()} VroomVault. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
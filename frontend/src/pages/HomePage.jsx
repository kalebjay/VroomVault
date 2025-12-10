import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

//
function HomePage() {
  return (
    <>
      <Link to="/login" className={styles.loginButton}>New User/Login</Link>
      <div>
        <h1 className={styles.title}>Vroom Vault</h1>
        <h2>This is your ultimate auto hub!</h2>
      </div>
      <p>Track all of your vehicles and toys all in one place!</p>
      <p>Check out the Vehicles</p>
      <Link to="/vehicles" className={styles.vehiclesButton}>Vehicles</Link>
      <div>
        <Link to="/test" className={styles.testButton}>Test</Link>
      </div>
    </>
  );
}

export default HomePage;
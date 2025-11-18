import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

//
function TestPage() {
  return (
    <>
      <div>
      <h1 className={styles.header}>Test Page</h1>
        <p>Check out the Vehicles</p>
        <Link to="/vehicles" className={styles.vehiclesButton}>Vehicles</Link>
      </div>
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </>
  );
}

export default TestPage;
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

//
function MaintenancePage() {
    return (
      <>
        <h1 className={styles.header}>Maintenance Page</h1>
        <div>
          <p>Check out the Vehicles</p>
          <Link to="/vehicles" className={styles.vehiclesButton}>Vehicles</Link>
        </div>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </>
    );
}

export default MaintenancePage;













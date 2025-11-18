import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

//
function VehiclesPage() {
    return (
      <>
        <h1 className={styles.header}>User Vehicles</h1>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </>
    )
}

export default VehiclesPage;



















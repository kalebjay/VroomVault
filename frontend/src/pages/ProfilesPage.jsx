import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';

//
function ProfilesPage() {
    return (
      <>
        <h1 className={styles.header}>Profile Page</h1>
        <div>
          <p>User settings</p>
        </div>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </>
    );
}

export default ProfilesPage;













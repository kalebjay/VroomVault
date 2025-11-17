import React from 'react';
import { Link } from 'react-router-dom';
import styles from './TestPage.module.css';


function TestPage() {
  return (
    <div>
      <h1 className={styles.header}>Test Page</h1>
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default TestPage;
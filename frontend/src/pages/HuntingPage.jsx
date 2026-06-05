import React from 'react';
import HuntingSection from '../components/HuntingSection';
import styles from './Pages.module.css'; // Using your existing page styles

const HuntingPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto', padding: '20px' }}>
        <HuntingSection />
      </div>
    </div>
  );
};

export default HuntingPage;
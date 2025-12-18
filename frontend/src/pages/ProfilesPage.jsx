import { React, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';
import styles from './Pages.module.css';

const ProfilesPage = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notification_days_advance: 30,
    notification_frequency: 'weekly',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.username) {
      setFormData({
        username: user.username,
        email: user.email,
        notification_days_advance: user.notification_days_advance || 30,
        notification_frequency: user.notification_frequency || 'weekly',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await apiClient.put(`/users/${user.id}`, formData);
      // Update user in AuthContext
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error("Update failed:", error.response); // Log the full response for debugging
      if (error.response && error.response.data && error.response.data.detail) {
        // Handle FastAPI validation errors
        if (Array.isArray(error.response.data.detail)) {
          const errorMsg = error.response.data.detail.map(d => `${d.loc[d.loc.length - 1]}: ${d.msg}`).join(', ');
          setError(`Validation Error: ${errorMsg}`);
        } else {
          // Handle other string-based detail errors (e.g., "Username already taken")
          setError(`Update failed: ${error.response.data.detail}`);
        }
      } else {
        setError('Failed to update profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Your Profile</h1>
      <p className={styles.subHeader}>Update your account settings</p>
      <form onSubmit={handleSubmit} className={styles.loginForm} style={{ maxWidth: '500px' }}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="notification_days_advance">Notify me (days in advance):</label>
          <input id="notification_days_advance" name="notification_days_advance" type="number" value={formData.notification_days_advance} onChange={handleChange} required min="1" />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="notification_frequency">Reminder frequency for past-due items:</label>
          <select id="notification_frequency" name="notification_frequency" value={formData.notification_frequency} onChange={handleChange} required>
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </div>
    </div>
  );
}

export default ProfilesPage;

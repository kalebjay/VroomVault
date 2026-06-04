import { React, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Added useNavigate
import { useAuth } from '../utils/AuthContext';
import apiClient from '../utils/apiClient';
import styles from './Pages.module.css';
import componentStyles from '../components/Components.module.css'; // Reuses your existing modal styles

const ProfilesPage = () => {
  const { user, setUser, logout } = useAuth(); // Assuming your AuthContext provides a logout function
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    notification_days_advance: 30,
    notification_frequency: 'weekly',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Account Deletion States
  const [showPasswordStep, setShowPasswordStep] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

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
      setUser(prevUser => ({ ...prevUser, ...response.data }));
      setSuccess('Profile updated successfully!');
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to update profile changes.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1 handler: Move from password verification to final confirmation warning
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!deletePassword) return;
    setShowPasswordStep(false);
    setShowFinalConfirm(true);
  };

  // Step 2 handler: Final approval to execute backend API call
  const handleExecuteDeletion = async () => {
    setError('');
    setLoading(true);
    try {
      await apiClient.delete(`/users/${user.id}`, {
        params: { password_confirm: deletePassword }
      });
      
      // Clean context state locally and redirect
      if (logout) logout(); 
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Account deletion failed. Check password.');
      setShowFinalConfirm(false);
      setDeletePassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>Your Profile</h1>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
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

      {/* Danger Zone Component Container */}
      <div className={styles.dangerZone}>
        <button 
          type="button" 
          className={styles.deleteAccountButton}
          onClick={() => { setShowPasswordStep(true); setError(''); setSuccess(''); }}
        >
          Delete Account
        </button>
      </div>

      {/* Password Prompt Modal Overlay */}
      {showPasswordStep && (
        <div className={componentStyles.modalOverlay}>
          <div className={componentStyles.modalContent}>
            <h2>Confirm Account Password</h2>
            <p>Please enter your password to proceed with deleting your account.</p>
            <form onSubmit={handlePasswordSubmit}>
              <input 
                type="password" 
                placeholder="Password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className={styles.passwordConfirmInput}
                required
              />
              <div className={styles.modalConfirmActions}>
                <button type="button" className={styles.confirmNoButton} onClick={() => { setShowPasswordStep(false); setDeletePassword(''); }}>Cancel</button>
                <button type="submit" className={styles.confirmYesButton}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Final Disclaimer Warning Pop-up */}
      {showFinalConfirm && (
        <div className={componentStyles.modalOverlay}>
          <div className={componentStyles.modalContent}>
            <h2 style={{ color: '#e74c3c' }}>Are you sure?</h2>
            <p>Are you sure you want to delete your account? This will remove your profile and all vehicles and their information.</p>
            <div className={styles.modalConfirmActions}>
              <button type="button" className={styles.confirmNoButton} onClick={() => { setShowFinalConfirm(false); setDeletePassword(''); }}>No</button>
              <button type="button" className={styles.confirmYesButton} onClick={handleExecuteDeletion} disabled={loading}>
                {loading ? 'Deleting...' : 'Yes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <Link to="/" className={styles.backButton}>Back to Home</Link>
      </div>
    </div>
  );
}

export default ProfilesPage;
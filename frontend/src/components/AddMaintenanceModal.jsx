import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import styles from './Components.module.css';

const AddMaintenanceModal = ({ isOpen, onClose, onMaintenanceAdded, vehicleId }) => {
  const [maintenanceData, setMaintenanceData] = useState({
    name: '',
    dueDate: '', // Consider using a date input type
    lastService: '', // Consider using a date input type
    interval: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setMaintenanceData({
        name: '',
        dueDate: '',
        lastService: '',
        interval: ''
      });
      setError(''); // Clear any previous errors
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      // NOTE: This assumes a backend endpoint for adding scheduled maintenance items.
      // Based on schemas.py, only 'MaintenanceRecordBase' (completed records) and
      // specific types like 'OilChangeRecordCreate' exist.
      // A new backend endpoint and schema would be needed for 'scheduled maintenance items'.
      const response = await apiClient.post(`/vehicles/${vehicleId}/maintenance-items`, maintenanceData);
      onMaintenanceAdded(vehicleId, response.data); // Pass the new item back to parent
      onClose(); // Close modal
    } catch (err) {
      setError('Failed to add maintenance item. Please try again.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Add New Maintenance Item</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <input name="name" value={maintenanceData.name} onChange={handleChange} placeholder="Maintenance Name" required />
            <input name="dueDate" type="date" value={maintenanceData.dueDate} onChange={handleChange} placeholder="Due Date" required />
            <input name="lastService" type="date" value={maintenanceData.lastService} onChange={handleChange} placeholder="Last Service Date" />
            <input name="interval" value={maintenanceData.interval} onChange={handleChange} placeholder="Interval (e.g., Every 6 months)" />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
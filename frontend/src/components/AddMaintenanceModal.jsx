import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import styles from './Components.module.css';
// This modal is now for adding COMPLETED maintenance records.
const AddMaintenanceModal = ({ isOpen, onClose, onMaintenanceAdded, vehicleId }) => {
  const [maintenanceData, setMaintenanceData] = useState({
    type: 'oil_change', // Default type
    date: new Date().toISOString().split('T')[0], // Default to today
    mileage: '',
    cost: '',
    description: '',
    // Oil Change specific
    oil_type: '',
    filter_part_number: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setMaintenanceData({
        type: 'oil_change',
        date: new Date().toISOString().split('T')[0],
        mileage: '',
        cost: '',
        description: '',
        oil_type: '',
        filter_part_number: '',
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

    const payload = {
      ...maintenanceData,
      mileage: parseInt(maintenanceData.mileage, 10),
      cost: parseFloat(maintenanceData.cost),
    };

    // Remove fields that don't belong to the selected type
    if (payload.type !== 'oil_change') {
      delete payload.oil_type;
      delete payload.filter_part_number;
    }

    try {
      const response = await apiClient.post(`/api/vehicles/${vehicleId}/maintenance`, payload);
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
            <select name="type" value={maintenanceData.type} onChange={handleChange}>
              <option value="oil_change">Oil Change</option>
              <option value="tire_change">Tire Change</option>
              {/* Add other types as you create them in the backend */}
            </select>
            <input name="date" type="date" value={maintenanceData.date} onChange={handleChange} required />
            <input name="mileage" type="number" value={maintenanceData.mileage} onChange={handleChange} placeholder="Mileage" required />
            <input name="cost" type="number" step="0.01" value={maintenanceData.cost} onChange={handleChange} placeholder="Cost ($)" required />
            <input name="description" value={maintenanceData.description} onChange={handleChange} placeholder="Description/Notes" required />
            
            {maintenanceData.type === 'oil_change' && (
              <>
                <input name="oil_type" value={maintenanceData.oil_type} onChange={handleChange} placeholder="Oil Type (e.g., 5W-30)" required />
                <input name="filter_part_number" value={maintenanceData.filter_part_number} onChange={handleChange} placeholder="Filter Part #" required />
              </>
            )}
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
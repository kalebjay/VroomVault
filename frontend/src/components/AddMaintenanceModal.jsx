import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import styles from './Components.module.css';


const AddMaintenanceModal = ({ isOpen, onClose, onMaintenanceAdded, onMaintenanceUpdated, vehicleId, itemToEdit }) => {
  const isEditMode = !!itemToEdit;
  const getInitialState = () => ({
    type: 'oil_change', // Default type
    date: new Date().toISOString().split('T')[0], // Default to today
    mileage: '',
    cost: '',
    description: '',
    oil_type: '',
    filter_part_number: '',
    tire_type: '',
    tire_part_number: '',
    brake_type: '',
    brake_part_number: '',
  });
  const [maintenanceData, setMaintenanceData] = useState(getInitialState());
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Reset form when modal is closed
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setMaintenanceData({
          ...getInitialState(),
          ...itemToEdit,
          date: itemToEdit.date ? itemToEdit.date.split('T')[0] : '',
        });
      } else {
        setMaintenanceData(getInitialState());
      }
      setError(''); // Clear any previous errors
    }
  }, [isOpen, itemToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Base payload with common fields
    const basePayload = {
      type: maintenanceData.type,
      date: maintenanceData.date,
      description: maintenanceData.description,
      mileage: parseInt(maintenanceData.mileage, 10),
      cost: parseFloat(maintenanceData.cost),
    };

    let finalPayload = { ...basePayload };

    // Add type-specific fields
    if (maintenanceData.type === 'oil_change') {
      finalPayload.oil_type = maintenanceData.oil_type;
      finalPayload.filter_part_number = maintenanceData.filter_part_number;
    } else if (maintenanceData.type === 'tire_rotation') {
      finalPayload.tire_type = maintenanceData.tire_type;
      finalPayload.tire_part_number = maintenanceData.tire_part_number;
    } else if (maintenanceData.type === 'tire_change') {
      finalPayload.tire_type = maintenanceData.tire_type;
      finalPayload.tire_part_number = maintenanceData.tire_part_number;
    } else if (maintenanceData.type === 'brake_change') {
      finalPayload.brake_type = maintenanceData.brake_type;
      finalPayload.brake_part_number = maintenanceData.brake_part_number;
    }

    try {
      if (isEditMode) {
        const response = await apiClient.put(`/vehicles/${vehicleId}/maintenance/${itemToEdit.id}`, finalPayload);
        onMaintenanceUpdated(vehicleId, response.data);
      } else {
        const response = await apiClient.post(`/vehicles/${vehicleId}/maintenance`, finalPayload);
        onMaintenanceAdded(vehicleId, response.data); // Pass the new item back to parent
      }
      onClose(); // Close modal
    } catch (err) {
      const errorMsg = isEditMode ? 'Failed to update maintenance item.' : 'Failed to add maintenance item.';
      setError(`${errorMsg} Please try again.`);
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
        <h2>{isEditMode ? 'Edit Maintenance Record' : 'Add New Maintenance Item'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <select name="type" value={maintenanceData.type} onChange={handleChange}>
              {/* Add other types as created in backend */}
              <option value="oil_change">Oil Change</option>
              <option value="tire_rotation">Tire Rotation</option>
              <option value="tire_change">Tire Change</option>
              <option value="brake_change">Brake Change</option>
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
            
            {maintenanceData.type === 'tire_rotation' && (
              <>
                <input name="tire_type" value={maintenanceData.tire_type} onChange={handleChange} placeholder="Tire Type (e.g., All-Season)" required />
                <input name="tire_part_number" value={maintenanceData.tire_part_number} onChange={handleChange} placeholder="Tire Part #" required />
              </>
            )}

            {maintenanceData.type === 'tire_change' && (
              <>
                <input name="tire_type" value={maintenanceData.tire_type} onChange={handleChange} placeholder="Tire Type (e.g., All-Season)" required />
                <input name="tire_part_number" value={maintenanceData.tire_part_number} onChange={handleChange} placeholder="Tire Part #" required />
              </>
            )}

            {maintenanceData.type === 'brake_change' && (
              <>
                <input name="brake_type" value={maintenanceData.brake_type} onChange={handleChange} placeholder="Brake Type/Brand" required />
                <input name="brake_part_number" value={maintenanceData.brake_part_number} onChange={handleChange} placeholder="Brake Part #" required />
              </>
            )}
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Record')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaintenanceModal;
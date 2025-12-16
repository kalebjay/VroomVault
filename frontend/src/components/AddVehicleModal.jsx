import React, { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import styles from './Components.module.css';

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded, onVehicleUpdated, vehicleToEdit }) => {
  const isEditMode = !!vehicleToEdit;

  const getInitialState = () => ({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    license_plate: '',
    exp_registration: '',
    exp_safety: '',
  });

  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    license_plate: '',
    exp_registration: '',
    exp_safety: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill form for editing or reset for adding
  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setVehicleData({
          ...getInitialState(),
          ...vehicleToEdit,
          // Format dates for the date input field (YYYY-MM-DD)
          exp_registration: vehicleToEdit.exp_registration ? vehicleToEdit.exp_registration.split('T')[0] : '',
          exp_safety: vehicleToEdit.exp_safety ? vehicleToEdit.exp_safety.split('T')[0] : '',
        });
      } else {
        setVehicleData(getInitialState());
      }
      setError(''); // Clear errors when modal opens
    }
  }, [isOpen, vehicleToEdit, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const payload = {
      ...vehicleData,
      year: parseInt(vehicleData.year, 10),
      // Ensure empty strings are sent as null for optional date fields
      exp_registration: vehicleData.exp_registration || null,
      exp_safety: vehicleData.exp_safety || null,
    };

    try {
      if (isEditMode) {
        // Update existing vehicle
        const response = await apiClient.put(`/vehicles/${vehicleToEdit.id}`, payload);
        onVehicleUpdated(response.data);
      } else {
        // Create new vehicle
        const response = await apiClient.post('/vehicles', payload);
        onVehicleAdded(response.data);
      }
      onClose(); // Close modal on success
    } catch (err) {
      const errorMsg = isEditMode ? 'Failed to update vehicle.' : 'Failed to create vehicle.';
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
        <h2>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <input name="make" value={vehicleData.make} onChange={handleChange} placeholder="Make" required />
            <input name="model" value={vehicleData.model} onChange={handleChange} placeholder="Model" required />
            <input name="year" type="number" value={vehicleData.year} onChange={handleChange} placeholder="Year" required />
            <input name="color" value={vehicleData.color} onChange={handleChange} placeholder="Color" />
            <input name="vin" value={vehicleData.vin} onChange={handleChange} placeholder="VIN" required />
            <input name="license_plate" value={vehicleData.license_plate} onChange={handleChange} placeholder="License Plate" required />
            
            {/* Labels for date inputs improve accessibility */}
            <label htmlFor="exp_registration">Registration Expiration</label>
            <input id="exp_registration" name="exp_registration" type="date" value={vehicleData.exp_registration} onChange={handleChange} />
            <label htmlFor="exp_safety">Safety Inspection Expiration</label>
            <input id="exp_safety" name="exp_safety" type="date" value={vehicleData.exp_safety} onChange={handleChange} />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? (isEditMode ? 'Saving...' : 'Adding...') : (isEditMode ? 'Save Changes' : 'Add Vehicle')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
import React, { useState } from 'react';
import apiClient from '../utils/apiClient';
import styles from './Components.module.css';

const AddVehicleModal = ({ isOpen, onClose, onVehicleAdded }) => {
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    license_plate: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    // Basic validation for year
    if (isNaN(parseInt(vehicleData.year, 10))) {
      setError('Year must be a number.');
      setSubmitting(false);
      return;
    }

    try {
      const response = await apiClient.post('/api/vehicles', {
        ...vehicleData, // Sends make, model, color, vin, license_plate
        year: parseInt(vehicleData.year, 10) // Ensure year is an integer
      });
      onVehicleAdded(response.data);
      onClose(); // Close modal on success
    } catch (err) {
      setError('Failed to create vehicle. Please try again.');
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
        <h2>Add New Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <input name="make" value={vehicleData.make} onChange={handleChange} placeholder="Make" required />
            <input name="model" value={vehicleData.model} onChange={handleChange} placeholder="Model" required />
            <input name="year" type="number" value={vehicleData.year} onChange={handleChange} placeholder="Year" required />
            <input name="color" value={vehicleData.color} onChange={handleChange} placeholder="Color" />
            <input name="vin" value={vehicleData.vin} onChange={handleChange} placeholder="VIN" />
            <input name="license_plate" value={vehicleData.license_plate} onChange={handleChange} placeholder="License Plate" />
          </div>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={submitting}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
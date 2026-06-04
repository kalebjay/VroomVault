import React, { useRef } from 'react';
import { FaPen, FaTrashAlt, FaPlus, FaCamera } from 'react-icons/fa';
import styles from './Components.module.css';
import MaintenanceItem from './MaintenanceItem';
import apiClient from '../utils/apiClient';

function VehicleCard({ vehicle, openMaintenanceModal, onEditMaintenance, onEditVehicle, onDeleteMaintenance, onDeleteVehicle, onVehicleUpdated }) {
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString(undefined, { timeZone: 'UTC' });
  };

  // Handles clicking the image area to simulate clicking the invisible system input tag
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiClient.post(`/vehicles/${vehicle.id}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (onVehicleUpdated) {
        onVehicleUpdated(response.data); // Keep vehicle lists fresh automatically
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to upload photo.');
    }
  };

  return (
    <div className={styles.vehicleCard}>
      <div className={styles.vehicleHeader}>
        <div className={styles.vehicleInfo}>
          
          {/* Interactive Smartphone Upload Container */}
          <div className={styles.vehicleIconContainer} onClick={handleImageClick} title="Upload Vehicle Photo">
            {vehicle.image_url ? (
              <img src={vehicle.image_url} alt="Vehicle Profile" className={styles.vehicleImageAvatar} />
            ) : (
              <div className={styles.imagePlaceholderIcon}>
                <FaCamera size={22} />
                <span className={styles.uploadMiniText}>Add Photo</span>
              </div>
            )}
            {/* Native device file hook (hidden to preserve custom styling look) */}
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              accept="image/jpeg,image/jpg,image/png,image/heic"
              onChange={handleFileChange} 
            />
          </div>

          <div>
            <h2 className={styles.vehicleName}>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h2>
            <p className={styles.vehicleDetails}>{`${vehicle.color} • ${vehicle.license_plate}`}</p>
            <div className={styles.vehicleSubDetails}>
              <div>Registration Exp: {formatDate(vehicle.exp_registration)}</div>
              <div>Safety Exp: {formatDate(vehicle.exp_safety)}</div>
            </div>
          </div>
        </div>
        <div className={styles.vehicleActions}>
          <button onClick={onEditVehicle} className={styles.iconButton} title="Edit Vehicle"><FaPen /></button>
          <button onClick={onDeleteVehicle} className={styles.iconButton} title="Delete Vehicle"><FaTrashAlt /></button>
        </div>
      </div>

      <div className={styles.maintenanceSection}>
        <div className={styles.maintenanceHeader}>
          <h3>Maintenance Items</h3>
          <button className={styles.addButton} onClick={() => openMaintenanceModal(vehicle.id)}><FaPlus /> Add</button>
        </div>
        {Array.isArray(vehicle.maint_records) && vehicle.maint_records.map(record => (
          <MaintenanceItem
            key={record.id}
            item={record}
            onEdit={() => onEditMaintenance(vehicle.id, record)}
            onDelete={() => onDeleteMaintenance(vehicle.id, record.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default VehicleCard;
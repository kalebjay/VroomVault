import React from 'react';
import { FaPen, FaTrashAlt, FaPlus } from 'react-icons/fa';
import styles from './Components.module.css';
import MaintenanceItem from './MaintenanceItem';

function VehicleCard({ vehicle, openMaintenanceModal, onEditMaintenance, onEditVehicle, onDeleteMaintenance, onDeleteVehicle }) {
  // Helper to format dates, returns 'N/A' if date is not available
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Adding timeZone to prevent off-by-one day errors
    return new Date(dateString).toLocaleDateString(undefined, { timeZone: 'UTC' });
  };

  return (
    <div className={styles.vehicleCard}>
      <div className={styles.vehicleHeader}>
        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleIcon}>
            {/* Vehicle Image to be added*/}      
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
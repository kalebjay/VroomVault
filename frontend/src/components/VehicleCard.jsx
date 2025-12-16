import React from 'react';
import { FaPen, FaTrashAlt, FaPlus } from 'react-icons/fa';
import styles from './Components.module.css';
import MaintenanceItem from './MaintenanceItem';

function VehicleCard({ vehicle, openMaintenanceModal, onDeleteMaintenance, onDeleteVehicle }) {
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
          </div>
        </div>
        <div className={styles.vehicleActions}>
          <button className={styles.iconButton}><FaPen /></button>
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
            onDelete={() => onDeleteMaintenance(vehicle.id, record.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default VehicleCard;
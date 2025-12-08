import React from 'react';
import { FaPen, FaTrashAlt, FaPlus } from 'react-icons/fa';
import styles from './Components.module.css';
import MaintenanceItem from './MaintenanceItem';

function VehicleCard({ vehicle }) {
  return (
    <div className={styles.vehicleCard}>
      <div className={styles.vehicleHeader}>
        <div className={styles.vehicleInfo}>
          <div className={styles.vehicleIcon}>
            {/* Vehicle Image to be added*/}      
          </div>
          <div>
            <h2 className={styles.vehicleName}>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h2>
            <p className={styles.vehicleDetails}>{`${vehicle.color} • ${vehicle.plate}`}</p>
          </div>
        </div>
        <div className={styles.vehicleActions}>
          <button className={styles.iconButton}><FaPen /></button>
          <button className={styles.iconButton}><FaTrashAlt /></button>
        </div>
      </div>

      <div className={styles.maintenanceSection}>
        <div className={styles.maintenanceHeader}>
          <h3>Maintenance Items</h3>
          <button className={styles.addButton}><FaPlus /> Add</button>
        </div>
        {vehicle.maintenanceItems.map(item => (
          <MaintenanceItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default VehicleCard;
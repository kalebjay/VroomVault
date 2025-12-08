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
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/><path d="M14 17H9"/>
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"/><path d="M5 17h2"/>
            <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>
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
import React from 'react';
import { FaTrashAlt, FaPen } from 'react-icons/fa';
import styles from './Components.module.css';

// This component now displays a COMPLETED maintenance record.
function MaintenanceItem({ item, onEdit, onDelete }) {
  const formattedDate = new Date(item.date).toLocaleDateString();

  return (
    <div className={styles.maintenanceItem}>
      <div className={styles.maintenanceItemHeader}>
        <div className={styles.itemName}>
          {/* Capitalize the type for display */}
          <h4>{item.type.replace('_', ' ')}</h4>
        </div>
        <div>
          <button onClick={onEdit} className={styles.iconButton} title="Edit Record"><FaPen /></button>
          <button onClick={onDelete} className={styles.iconButton} title="Delete Record"><FaTrashAlt /></button>
        </div>
      </div>
      <p className={styles.itemDetail}>Date: {formattedDate} • Mileage: {item.mileage.toLocaleString()} • Cost: ${item.cost.toFixed(2)}</p>
      <p className={styles.itemDetail}>Notes: {item.description}</p>
    </div>
  );
}

export default MaintenanceItem;
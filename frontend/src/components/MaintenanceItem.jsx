import React from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import styles from './Components.module.css';

function MaintenanceItem({ item }) {
  const statusClass = item.status === 'Overdue' ? styles.overdue : styles.dueSoon;

  return (
    <div className={styles.maintenanceItem}>
      <div className={styles.itemHeader}>
        <div className={styles.itemName}>
          <h4>{item.name}</h4>
          <span className={`${styles.statusBadge} ${statusClass}`}>{item.status}</span>
        </div>
        <button className={styles.iconButton}><FaTrashAlt /></button>
      </div>
      <p className={styles.itemDetail}>Due: {item.dueDate}</p>
      {item.lastService && <p className={styles.itemDetail}>Last: {item.lastService}</p>}
      {item.interval && <p className={styles.itemDetail}>{item.interval}</p>}
    </div>
  );
}

export default MaintenanceItem;
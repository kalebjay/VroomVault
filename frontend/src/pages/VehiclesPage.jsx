import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';
import VehicleCard from '../components/VehicleCard';

//
function VehiclesPage() {
  // Mock data based on the image
  const vehicles = [
    {
      id: 1,
      year: 2020,
      make: 'Toyota',
      model: 'Highlander',
      color: 'Silver',
      plate: 'ABC-1234',
      maintenanceItems: [
        {
          id: 1,
          name: 'Vehicle Registration',
          status: 'Overdue',
          dueDate: '6/29/2025',
        },
        {
          id: 2,
          name: 'Oil Change',
          status: 'Due Soon',
          dueDate: '12/14/2025',
          lastService: '9/14/2024',
          interval: 'Every 6 months or 5,000 miles',
        },
      ],
    },
    {
      id: 1,
      year: 2002,
      make: 'Chrylser',
      model: 'Sebring',
      color: 'White',
      plate: 'ZKELF',
      maintenanceItems: [
        {
          id: 1,
          name: 'Vehicle Registration',
          status: 'Due',
          dueDate: '6/29/2026',
        },
        {
          id: 2,
          name: 'Oil Change',
          status: 'Due Soon',
          dueDate: '12/14/2025',
          lastService: '9/14/2024',
          interval: 'Every 3 months or 3,000 miles',
        },
      ],
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>My Vehicles</h1>
      <p className={styles.subHeader}>Track your vehicles and maintenance schedules</p>
      {vehicles.map(vehicle => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default VehiclesPage;

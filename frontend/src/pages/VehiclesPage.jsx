import { React, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';
import VehicleCard from '../components/VehicleCard';


const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await apiClient.get('/vehicles');
        setVehicles(response.data);
      } catch (err) {
        setError('Failed to fetch vehicles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
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

{/* Code to try next
  
  return (
    <div>
      <h1>My Vehicles</h1>
      
      {vehicles.length === 0 ? (
        <p>You haven't added any vehicles yet.</p>
      ) : (
        <ul>
          {vehicles.map((vehicle) => (
            <li key={vehicle.id}>
              {vehicle.year} {vehicle.make} {vehicle.model} - VIN: {vehicle.vin}
            </li>
          ))}
        </ul>
      )}
    </div>
  ) 
    
*/}



{/* Test Data

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
  
  
  */}
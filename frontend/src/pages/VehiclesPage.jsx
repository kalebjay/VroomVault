import { React, useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import { Link } from 'react-router-dom';
import styles from './Pages.module.css';
import VehicleCard from '../components/VehicleCard';
import AddVehicleModal from '../components/AddVehicleModal';
import AddMaintenanceModal from '../components/AddMaintenanceModal'; // New import


const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState(''); // For errors on delete/update actions
  const [modalState, setModalState] = useState({
    addVehicle: false,
    addMaintenance: false,
    editVehicle: null, // Will hold the vehicle object to edit
    selectedVehicleId: null,
  });

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

  const handleVehicleAdded = (newVehicle) => {
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
    setModalState({ ...modalState, addVehicle: false });
  };

  const handleVehicleUpdated = (updatedVehicle) => {
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
    // Close modal and clear editing state
    setModalState({ ...modalState, editVehicle: null });
  };

  // New handler for adding maintenance items
  const handleMaintenanceAdded = (vehicleId, newMaintenanceItem) => {
    setActionError('');
    setVehicles(prevVehicles =>
      prevVehicles.map(vehicle =>
        vehicle.id === vehicleId
          ? { ...vehicle, maint_records: [...(vehicle.maint_records || []), newMaintenanceItem] }
          : vehicle
      )
    );
    // Close modal and clear selected vehicle
    setModalState({ ...modalState, addMaintenance: false, selectedVehicleId: null });
  };

  const openMaintenanceModal = (vehicleId) => {
    setActionError('');
    setModalState({ ...modalState, addMaintenance: true, selectedVehicleId: vehicleId });
  };

  const handleMaintenanceDeleted = async (vehicleId, recordId) => {
    // Optional: Add a confirmation dialog before deleting
    // if (!window.confirm("Are you sure you want to delete this maintenance record?")) {
    //   return;
    // }
    try {
      await apiClient.delete(`/vehicles/${vehicleId}/maintenance/${recordId}`);
      setActionError('');
      // Update state to remove the item from the UI
      setVehicles(prevVehicles =>
        prevVehicles.map(v => v.id === vehicleId ? { ...v, maint_records: v.maint_records.filter(r => r.id !== recordId) } : v)
      );
    } catch (err) {
      console.error("Failed to delete maintenance record", err);
      setActionError('Failed to delete maintenance record. Please try again.');
    }
  };

  const handleVehicleDeleted = async (vehicleId) => {
    if (window.confirm("Are you sure you want to permanently delete this vehicle and all its records?")) {
      try {
        await apiClient.delete(`/vehicles/${vehicleId}`);
        setActionError('');
        // Update state to remove the vehicle from the UI
        setVehicles(prevVehicles => prevVehicles.filter(v => v.id !== vehicleId));
      } catch (err) {
        console.error("Failed to delete vehicle", err);
        setActionError("Failed to delete vehicle. Please try again.");
      }
    }
  };

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  
  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerContainer}>
        <div>
          <h1 className={styles.header}>My Vehicles</h1>
          <p className={styles.subHeader}>Track your vehicles and maintenance schedules</p>
        </div>
        <button onClick={() => setModalState({ ...modalState, addVehicle: true })} className={styles.button}>
          Add Vehicle
        </button>
      </div>
      {actionError && <p style={{ color: 'red' }}>{actionError}</p>}
      {vehicles.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No vehicles found.</p>
          <p>Click "Add Vehicle" to get started!</p>
        </div>
      ) : (
        <ul>
          {vehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              openMaintenanceModal={openMaintenanceModal}
              onEditVehicle={() => setModalState({ ...modalState, editVehicle: vehicle })}
              onDeleteMaintenance={handleMaintenanceDeleted} // Pass delete handler
              onDeleteVehicle={() => handleVehicleDeleted(vehicle.id)}
            />
          ))}
        </ul>
      )}
      <AddVehicleModal
        isOpen={modalState.addVehicle || !!modalState.editVehicle}
        onClose={() => setModalState({ ...modalState, addVehicle: false, editVehicle: null })}
        onVehicleAdded={handleVehicleAdded}
        onVehicleUpdated={handleVehicleUpdated}
        vehicleToEdit={modalState.editVehicle}
      />
      <AddMaintenanceModal // New modal
        isOpen={modalState.addMaintenance}
        onClose={() => setModalState({ ...modalState, addMaintenance: false, selectedVehicleId: null })}
        onMaintenanceAdded={handleMaintenanceAdded}
        vehicleId={modalState.selectedVehicleId}
      />
      <Link to="/" className={styles.backButton}>Back to Home</Link>
    </div>
  );
}

export default VehiclesPage;

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
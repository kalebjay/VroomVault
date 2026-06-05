import React, { useState, useEffect } from 'react';

const HuntingSection = () => {
  const [hunts, setHunts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    max_price: '',
    max_miles: '',
    min_year: '',
    required_roof_height: '',
    required_wheelbase_inches: '',
    required_bed_length_inches: '',
    required_passenger_capacity: ''
  });

  // Fetch all active hunts from the backend
  const fetchHunts = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scraper/preferences');
      if (response.ok) {
        const data = await response.json();
        setHunts(data);
      }
    } catch (error) {
      console.error("Error fetching hunting preferences:", error);
    }
  };

  useEffect(() => {
    fetchHunts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format fields cleanly for the Pydantic backend model
    const payload = {
      make: formData.make,
      model: formData.model,
      max_price: parseFloat(formData.max_price),
      max_miles: parseInt(formData.max_miles),
      min_year: formData.min_year ? parseInt(formData.min_year) : null,
      required_roof_height: formData.required_roof_height || null,
      required_wheelbase_inches: formData.required_wheelbase_inches ? parseFloat(formData.required_wheelbase_inches) : null,
      required_bed_length_inches: formData.required_bed_length_inches ? parseFloat(formData.required_bed_length_inches) : null,
      required_passenger_capacity: formData.required_passenger_capacity ? parseInt(formData.required_passenger_capacity) : null,
      is_active: true
    };

    try {
      const response = await fetch('http://localhost:8000/api/scraper/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Reset form inputs & update active list instantly
        setFormData({
          make: '', model: '', max_price: '', max_miles: '', min_year: '',
          required_roof_height: '', required_wheelbase_inches: '', required_bed_length_inches: '', required_passenger_capacity: ''
        });
        fetchHunts();
      }
    } catch (error) {
      console.error("Error saving search preference:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/scraper/preferences/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setHunts(prev => prev.filter(hunt => hunt.id !== id));
      }
    } catch (error) {
      console.error("Error deleting hunt preference:", error);
    }
  };

  // Helper check to determine if the vehicle target is a van or truck profile
  const isTransit = formData.model.toLowerCase().includes('transit');
  const isTruck = ['f-250', 'f-350', '2500', '3500', 'silverado', 'ram', 'sierra', 'truck'].some(kw => 
    formData.model.toLowerCase().includes(kw) || formData.make.toLowerCase().includes(kw)
  );

  return (
    <div className="hunting-container">
      <h2>🎯 Vehicle Hunter Setup</h2>
      <p className="hunting-subtitle">Deploy a background scraper drone to isolate highly specific utility configurations.</p>
      
      {/* 1. Configuration Form */}
      <form onSubmit={handleSubmit} className="hunting-form">
        <div className="form-row">
          <input required type="text" name="make" placeholder="Make (e.g. Ford)" value={formData.make} onChange={handleInputChange} className="hunting-input" />
          <input required type="text" name="model" placeholder="Model (e.g. Transit, F-250)" value={formData.model} onChange={handleInputChange} className="hunting-input" />
        </div>

        <div className="form-row">
          <input required type="number" name="max_price" placeholder="Max Price ($)" value={formData.max_price} onChange={handleInputChange} className="hunting-input" />
          <input required type="number" name="max_miles" placeholder="Max Mileage" value={formData.max_miles} onChange={handleInputChange} className="hunting-input" />
          <input type="number" name="min_year" placeholder="Min Year" value={formData.min_year} onChange={handleInputChange} className="hunting-input" />
        </div>

        {/* Dynamic Fields Layer for Transits */}
        {isTransit && (
          <div className="dynamic-config-box transit-config">
            <h4 className="config-box-title">🚐 Transit Layout Configurations</h4>
            <div className="form-row">
              <select name="required_roof_height" value={formData.required_roof_height} onChange={handleInputChange} className="hunting-input">
                <option value="">Any Roof Height</option>
                <option value="Low">Low Roof</option>
                <option value="Medium">Medium Roof</option>
                <option value="High">High Roof</option>
              </select>
              <input type="number" name="required_wheelbase_inches" placeholder="Wheelbase (e.g. 148)" value={formData.required_wheelbase_inches} onChange={handleInputChange} className="hunting-input" />
              <input type="number" name="required_passenger_capacity" placeholder="Pax Count (e.g. 15)" value={formData.required_passenger_capacity} onChange={handleInputChange} className="hunting-input" />
            </div>
          </div>
        )}

        {/* Dynamic Fields Layer for Heavy Duty Pickups */}
        {isTruck && !isTransit && (
          <div className="dynamic-config-box truck-config">
            <h4 className="config-box-title">🛻 Pickup Structural Specifications</h4>
            <select name="required_bed_length_inches" value={formData.required_bed_length_inches} onChange={handleInputChange} className="hunting-input">
              <option value="">Any Box Configuration</option>
              <option value="96.0">8-Foot Long Bed Only (96")</option>
              <option value="78.0">Standard Bed (~6.5ft / 78")</option>
            </select>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Activating Drone...' : '🚀 Activate Hunt Profile'}
        </button>
      </form>

      {/* 2. List of Active Footprints */}
      <h3>📡 Active Hunting Transmitters</h3>
      {hunts.length === 0 ? (
        <p className="no-hunts-text">No active hunting footprints configured. The scraper is idle.</p>
      ) : (
        <div className="transmitter-list">
          {hunts.map((hunt) => (
            <div key={hunt.id} className="transmitter-card">
              <div className="transmitter-details">
                <strong className="transmitter-title">{hunt.make.toUpperCase()} {hunt.model}</strong>
                <div className="transmitter-meta">
                  <span>Max: ${hunt.max_price.toLocaleString()}</span> • <span>Max: {hunt.max_miles.toLocaleString()} mi</span>
                  {hunt.min_year && <span> • Min Year: {hunt.min_year}</span>}
                </div>
                {/* Specific constraints tags */}
                <div className="tag-container">
                  {hunt.required_roof_height && <span className="spec-tag">Roof: {hunt.required_roof_height}</span>}
                  {hunt.required_wheelbase_inches && <span className="spec-tag">WB: {hunt.required_wheelbase_inches}"</span>}
                  {hunt.required_passenger_capacity && <span className="spec-tag">Capacity: {hunt.required_passenger_capacity} Pax</span>}
                  {hunt.required_bed_length_inches && <span className="spec-tag">{hunt.required_bed_length_inches >= 96 ? '🚨 True 8-Ft Bed' : 'Short Bed'}</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(hunt.id)} className="deactivate-btn">
                Deactivate
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HuntingSection;
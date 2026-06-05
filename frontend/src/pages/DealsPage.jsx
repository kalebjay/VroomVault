import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaTags, FaFire } from 'react-icons/fa';
import styles from './Pages.module.css';

const DealsPage = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/scraper/deals');
      if (response.ok) {
        const data = await response.json();
        setDeals(data);
      }
    } catch (error) {
      console.error("Error pulling intercepted deals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    // Poll for new automated scraper hits every 30 seconds while sitting on this page
    const interval = setInterval(fetchDeals, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ margin: 0, color: '#ecf0f1' }}>🔥 Intercepted Golden Deals</h1>
            <p style={{ color: '#bdc3c7', margin: '5px 0 0 0' }}>Vehicles identified below market value matching your exact physical utility specs.</p>
          </div>
          <button onClick={fetchDeals} className={styles.ctaButton} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            🔄 Refresh Feed
          </button>
        </div>

        {loading ? (
          <p style={{ color: '#bdc3c7', fontStyle: 'italic' }}>Scanning vaults for matching data profiles...</p>
        ) : deals.length === 0 ? (
          <div style={{ backgroundColor: '#2c3e50', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#7f8c8d' }}>
            <p style={{ fontSize: '1.2rem', margin: 0 }}>No high-value assets identified yet.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '5px' }}>The background drone is searching. Refine your Hunter configurations if thresholds are too restrictive.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {deals.map((deal) => (
              <div key={deal.id} style={{ backgroundColor: '#2c3e50', borderRadius: '8px', overflow: 'hidden', border: '1px solid #4f5d73', display: 'flex', flexDirection: 'column' }}>
                
                {/* Deal Header Badge */}
                <div style={{ backgroundColor: '#e67e22', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 'bold', fontSize: '0.85rem' }}>
                  <FaFire /> SAVE ${deal.market_discount.toLocaleString()} BELOW MARKET
                </div>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '1.25rem' }}>{deal.title}</h3>
                    <div style={{ fontSize: '0.85rem', color: '#bdc3c7', marginBottom: '12px' }}>
                      VIN: <code style={{ color: '#ff9900', backgroundColor: '#22313f', padding: '2px 4px', borderRadius: '4px' }}>{deal.vin}</code>
                    </div>

                    {/* Pricing Core Metrics */}
                    <div style={{ display: 'flex', gap: '15px', backgroundColor: '#22313f', padding: '10px', borderRadius: '6px', marginBottom: '15px' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#7f8c8d', textTransform: 'uppercase' }}>Listing Price</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2ecc71' }}>${deal.price.toLocaleString()}</div>
                      </div>
                      <div style={{ borderLeft: '1px solid #4f5d73', paddingLeft: '15px' }}>
                        <div style={{ fontSize: '0.75rem', color: '#7f8c8d', textTransform: 'uppercase' }}>Est. Market Value</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#95a5a6', textDecoration: 'line-through' }}>${deal.market_average_price.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Physical Attributes Extracted via VIN decoder */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '15px' }}>
                      <span style={badgeStyle}>📍 {deal.miles.toLocaleString()} mi</span>
                      {deal.roof_height && deal.roof_height !== 'Unknown' && <span style={badgeStyle}>🚐 {deal.roof_height} Roof</span>}
                      {deal.wheelbase_inches && <span style={badgeStyle}>📐 {deal.wheelbase_inches}" WB</span>}
                      {deal.passenger_capacity && <span style={badgeStyle}>👥 {deal.passenger_capacity} Pax</span>}
                      {deal.bed_length_inches && <span style={badgeStyle}>🛻 {deal.bed_length_inches}" Box</span>}
                    </div>
                  </div>

                  {/* Outbound Link Actions */}
                  <a href={deal.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', backgroundColor: '#34495e', color: '#fff', textDecoration: 'none', padding: '10px', borderRadius: '4px', fontWeight: 'bold', border: '1px solid #4f5d73', transition: 'background 0.2s' }}>
                    View Original Listing <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const badgeStyle = {
  backgroundColor: '#34495e',
  color: '#ecf0f1',
  fontSize: '0.75rem',
  padding: '4px 8px',
  borderRadius: '4px',
  border: '1px solid #4f5d73'
};

export default DealsPage;

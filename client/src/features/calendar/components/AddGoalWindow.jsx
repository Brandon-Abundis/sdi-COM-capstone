import React, { useState } from 'react';

const AddGoalWindow = ({ onEventCreated }) => {
  const [query, setQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState(new Set());

  // Mock map data for selection
  const locations = [
    { id: 1, name: 'Grand Ballroom', type: 'Indoor' },
    { id: 2, name: 'Sun Terrace', type: 'Outdoor' },
    { id: 3, name: 'Conference Suite A', type: 'Indoor' },
    { id: 4, name: 'Main Lobby', type: 'Indoor' },
  ];

  const toggleSelection = (id) => {
    const next = new Set(selectedLocations);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedLocations(next);
  };

  const handleFinish = () => {
    const finalEvent = locations.filter(loc => selectedLocations.has(loc.id));
    onEventCreated(finalEvent);
    console.log("Event Compiled:", finalEvent);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Plan Your Big Event</h1> {/* Title Area */}
      
      {/* Search Bar */}
      <input 
        type="text" 
        placeholder="Find a location..." 
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />

      {/* Map Outline Representation */}
      <div style={{ 
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', 
        border: '2px dashed #ccc', padding: '20px', borderRadius: '8px' 
      }}>
        {locations
          .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
          .map(loc => (
            <div 
              key={loc.id}
              onClick={() => toggleSelection(loc.id)}
              style={{
                padding: '20px', border: '1px solid #000', cursor: 'pointer',
                backgroundColor: selectedLocations.has(loc.id) ? '#d1e7dd' : '#fff',
                textAlign: 'center'
              }}
            >
              <strong>{loc.name}</strong>
              <p style={{ margin: 0, fontSize: '0.8rem' }}>{loc.type}</p>
            </div>
          ))}
      </div>

      <button 
        onClick={handleFinish}
        disabled={selectedLocations.size === 0}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
      >
        Compile Event ({selectedLocations.size} items)
      </button>
    </div>
  );
};

export default AddGoalWindow;
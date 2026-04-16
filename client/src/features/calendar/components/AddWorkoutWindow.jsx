    import React, { useState, useEffect} from 'react';
    import { useAuth } from "../../../app/AuthProvider.jsx";

    export default function AddWorkoutWindow({setAddWorkoutOpen, selectedEvent}) {
        const { user } = useAuth();
        const [query, setQuery] = useState("");
        const [selectedLocations, setSelectedLocations] = useState(new Set());
        const [WorkoutLibrary, setWorkoutLibrary] = useState([])
        const [hasRun, setHasRun] = useState(false);

    useEffect(() => {
    
        if (!user?.id) return;
    fetch(`http://localhost:8080/users/user_workouts/id/${user.id}`)
    .then((r) => r.json())
    .then((data) => setWorkoutLibrary(Array.isArray(data) ? data : []))
    .catch(() => setWorkoutLibrary([]));
    }, [user?.id]);

    // console.log(Object.keys(selectedEvent));

    useEffect(() => {
        if (WorkoutLibrary.length > 0 && selectedEvent?.workouts_list && !hasRun) {
            const existingIds = selectedEvent.workouts_list;
            setSelectedLocations(new Set(existingIds));
            setHasRun(true)
        }
    }, [WorkoutLibrary, selectedEvent, hasRun]);

    // console.log(WorkoutLibrary)
    const toggleSelection = (id) => {
        const next = new Set(selectedLocations);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedLocations(next);
    };

    const handleFinish = () => {
        const finalEvent = WorkoutLibrary.filter(loc => selectedLocations.has(loc.id));
        setAddWorkoutOpen(false)
        setHasRun(false)
        // console.log("Event Compiled:", finalEvent);
    };

    return (
        <>
            <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
                <h1>Select workouts for Event</h1> 
                <input 
                    type="text" 
                    placeholder="Search..." 
                    onChange={(e) => setQuery(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                />
                {/* TESTTESTTEST */}
                <div style={{
                maxHeight: '400px',   
                overflowY: 'auto',   
                border: '2px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                backgroundColor: '#16112a'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '10px'
                }}>
                    {WorkoutLibrary
                        .filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()))
                        .map(loc => (
                            <div
                                key={loc.id}
                                onClick={() => {toggleSelection(loc.id); console.log(Object.keys(loc))}}
                                style={{
                                    padding: '20px',
                                    border: '1px solid #000',
                                    cursor: 'pointer',
                                    backgroundColor: Array.from(selectedLocations).some(id => Number(id) === Number(loc.id)) ? '#0d7345' : '#5e0505',
                                    textAlign: 'center',
                                    borderRadius: '4px'
                                }}
                            >
                                <strong>{loc.name}</strong>
                                <p style={{ margin: 0, fontSize: '0.8rem' }}>{loc.type}, {loc.distance ? (`${loc.distance} mi,`) : ''} {loc.weight > 0 ? (`${loc.weight} lbs,`) : ""} {loc.notes}</p>
                                <p style={{ margin: 0, fontSize: '0.8rem' }}>Created at {(loc.created_at).split("T")[0]}</p>
                            </div>
                        ))}
                </div>
            </div>
                {/* <div style={{ 
                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', 
                    border: '2px dashed #ccc', padding: '20px', borderRadius: '8px' 
                }}>
                {WorkoutLibrary
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
                </div> */}
                <button 
                    onClick={handleFinish}
                    disabled={selectedLocations.size === 0}
                    style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', border: "2px solid black" }}
                >
                    Save {selectedLocations.size} workouts
                </button>
            </div>
        </>
        );
    };
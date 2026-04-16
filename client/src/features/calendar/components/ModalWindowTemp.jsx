import React, { useState, useEffect} from 'react';
import AddGoalWindow from "./AddGoalWindow.jsx"
import AddWorkoutWindow from "./AddWorkoutWindow.jsx";

export default function ModalWindowTemp({addGoalOpen, setAddGoalOpen, addWorkoutOpen, setAddWorkoutOpen, selectedEvent}) {
  const [query, setQuery] = useState("");
  const [selectedLocations, setSelectedLocations] = useState(new Set());

    return (
        <>
            {(addGoalOpen || addWorkoutOpen) && (
                <div 
                    onClick={() => {setAddGoalOpen(false); setAddWorkoutOpen(false)}} 
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999
                    }}  className="modal-window-bg"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()} 
                        // here because if I don't put it existing CSS will take over and reformat page. This will always take pri. same 4 others
                        style={{
                            backgroundColor: '#16112a',
                            padding: '16px',
                            borderRadius: '16px',
                            border: '1px solid #1e1838',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                            maxWidth: '600px',
                            width: '90%',
                            fontFamily: 'sans-serif'
                        }}
                    >
                        {addGoalOpen && (<AddGoalWindow setAddGoalOpen={setAddGoalOpen} />)}
                        {addWorkoutOpen && (<AddWorkoutWindow setAddWorkoutOpen={setAddWorkoutOpen} selectedEvent={selectedEvent}/>)}
                    </div>
                </div>
                )}
        </>
    );
};
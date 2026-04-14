import { useState } from "react";

export default function useCreateUserEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitEvent = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/users/user_events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // matches the { name, date, time, user_id } expected by your controller
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create event");
      }

      return data; // Return the new event object to the component
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submitEvent, loading, error };
}
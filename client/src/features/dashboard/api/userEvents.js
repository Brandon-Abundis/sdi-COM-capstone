const BASE_URL = "http://localhost:8080";

export const fetchUserEvents = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/user_events/id/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user events");
    }
    const events = await res.json();
    return events;
  } catch (error) {
    console.error("Error fetching user events:", error);
    throw error;
  }
};

export const fetchUserWorkouts = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/user_workouts/id/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user workouts");
    }
    const workouts = await res.json();
    return workouts;
  } catch (error) {
    console.error("Error fetching user workouts:", error);
    throw error;
  }
};

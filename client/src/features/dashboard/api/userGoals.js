const BASE_URL = "http://localhost:8080";

export const fetchUserGoals = async (userId) => {
  try {
    const res = await fetch(`${BASE_URL}/users/user_goals/id/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch user goals");
    }
    const goals = await res.json();
    return goals;
  } catch (error) {
    console.error("Error fetching user goals:", error);
    throw error;
  }
};

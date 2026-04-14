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

export const createUserGoal = async (goalData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/user_goals/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    });
    if (!res.ok) {
      throw new Error("Failed to create user goal");
    }
    const newGoal = await res.json();
    return newGoal;
  } catch (error) {
    console.error("Error creating user goal:", error);
    throw error;
  }
};

export const updateUserGoal = async (goalId, goalData) => {
  try {
    const res = await fetch(`${BASE_URL}/users/user_goals/update/id/${goalId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goalData),
    });
    if (!res.ok) {
      throw new Error("Failed to update user goal");
    }
    const updatedGoal = await res.json();
    return updatedGoal;
  } catch (error) {
    console.error("Error updating user goal:", error);
    throw error;
  }
};

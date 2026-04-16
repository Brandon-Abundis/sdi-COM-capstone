const BASE_URL = "http://localhost:8080";

export const fetchAllUsers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/users/`);
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await res.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateUserXP = async (userId, newXp) => {
  try {
    const res = await fetch(`${BASE_URL}/users/id/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xp: String(newXp) }),
    });
    if (!res.ok) {
      throw new Error("Failed to update user XP");
    }
    const updatedUser = await res.json();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user XP:", error);
    throw error;
  }
};

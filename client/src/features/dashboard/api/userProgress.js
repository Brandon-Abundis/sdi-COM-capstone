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

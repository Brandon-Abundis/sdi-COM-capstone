export default async function delete_account(id) {
  try {
    const response = await fetch(`http://localhost:8080/users/id/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete the user");
    }

    if (response.ok) {
      setUserData(null);
    }

    console.log("Account deleted successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

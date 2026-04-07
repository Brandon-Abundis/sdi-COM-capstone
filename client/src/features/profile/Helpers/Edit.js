export default async function edit(id) {
  try {
    const response = await fetch(`http://localhost:8080/user/${id}`, {
      method: "PATCH",
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to edit the user");
    }

    if (response.ok) {
      const updatedData = await response.json();
      setUserData(updatedData);
      setIsEditing(false);
    }

    console.log("Account edited successfully");
  } catch (error) {
    console.error("Error:", error);
  }
}

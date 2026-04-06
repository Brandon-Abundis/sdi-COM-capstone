import { useState, useEffect } from "react";

export default function ProfileInfo() {
  const [userData, setUserData] = useState({
    id: 1,
    is_admin: false,
    first_name: "First",
    last_name: "Last",
    password: "password",
    email: "email",
    rank: "rank",
    gender: "gender",
    age: "age",
    xp: "xp",
    updated_at: "time_stamp",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // This is the delte account functionality that currently doesn't work because the data strucutre doesn't exists yet.
  async function delete_account(email) {
    try {
      const response = await fetch(`http://localhost:8080/user/${email}`, {
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

  // This is the edit account functionality that currently doesn't work because the data strucutre doesn't exists yet.
  async function edit(email) {
    try {
      const response = await fetch(`http://localhost:8080/user/${email}`, {
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

  //   This will be the useEffect to fetch user data from express API.
  //   useEffect(() => {
  //     fetch(`http://localhost:8080/user/${email}`)
  //       .then((res) => res.json())
  //       .then((data) => {
  //         return setUserData(data);
  //       });
  //   }, []);

  if (!userData) return <h1>Loading...</h1>;

  return (
    <div>
      <div className="avatar">
        <div className="w-24 rounded-full">
          <img src="https://img.daisyui.com/images/profile/demo/yellingcat@192.webp" />
        </div>
      </div>

      {isEditing ? (
        <div className="form-control w-full gap-2">
          <input
            type="text"
            className="input input-bordered input-sm"
            value={formData.first_name}
            placeholder="Name"
            onChange={(e) =>
              setFormData({ ...formData, first_name: e.target.value })
            }
          />
          <input
            className="input input-bordered input-sm"
            placeholder="Last"
            value={formData.last_name}
            onChange={(e) =>
              setFormData({ ...formData, last_name: e.target.value })
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 grid-rows-2 h-screen w-full bg-base-300">
          <div className="p-8 flex justify-start items-start"></div>
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="card-title text-2xl font-black">
                    {userData.first_name} {userData.last_name}
                  </h2>
                  <p className="text-primary font-medium flex items-center gap-2">
                    <span className="badge badge-primary badge-outline rounded-full px-4 py-3 font-semibold text-xs uppercase tracking-wider">
                      {userData.rank}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase opacity-50 font-bold">
                    Email
                  </p>
                  <p className="text-sm font-semibold">{userData.email}</p>
                </div>
              </div>

              <div className="divider my-0"></div>

              <div className="stats shadow bg-base-200">
                <div className="stat py-2">
                  <div className="stat-title text-xs">Age</div>
                  <div className="stat-value text-lg">{userData.age}</div>
                </div>
                <div className="stat py-2">
                  <div className="stat-title text-xs">Account Status</div>
                  <div className="stat-desc text-success text-xs font-bold font-mono uppercase">
                    Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="card-actions mt-4">
        {isEditing ? (
          <>
            <button className="btn btn-primary btn-sm" onClick={edit}>
              Save Changes
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-soft btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-soft btn-error"
              onClick={() => delete_acount(userData.email)}
            >
              {" "}
              Delete Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}

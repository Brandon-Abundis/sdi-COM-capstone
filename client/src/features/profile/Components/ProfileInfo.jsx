import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Avatar from "./Avatar";

export default function ProfileInfo({ userData, setUserData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });
  const [groups, setGroups] = useState();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(` http://localhost:8080/users/groups/id/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (userData.is_active === true) {
          setGroups(data);
        }
      });
  }, []);

  async function edit(id, formData) {
    try {
      const response = await fetch(`http://localhost:8080/users/id/${id}`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
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
  async function delete_account(id) {
    try {
      const response = await fetch(`http://localhost:8080/users/id/${id}`, {
        method: "POST",
        body: JSON.stringify({ ...userData, is_active: false }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to edit the user");
      }

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setIsEditing(false);
      }

      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (!userData) return <h1>Loading...</h1>;
  if (!groups) return <h1>Loading...</h1>;

  const initials =
    `${userData.first_name.slice(0, 1)}${userData.last_name.slice(0, 1)}`.toUpperCase();

  return (
    <>
      <div id="test">
        <div id="profile section">
          <div className="flex flex-col items-start justify-start gap-4">
            <div className="card bg-base-100 shadow-2xl border border-base-200 w-full max-w-md">
              <div className="card-body p-6">
                <div className="avatar mb-2">
                  <div className="w-20 h-20 flex items-center justify-center rounded-full outline outline-1 outline-accent bg-neutral select-none cursor-default">
                    {/* <span className="text-sm font-bold text-[#c084fc] leading-none">
                      {initials}
                    </span> */}
                    <Avatar></Avatar>
                <div className="avatar mb-2 group relative w-24 h-24">
                  <div className="w-full h-full flex items-center justify-center rounded-full outline outline-1 outline-accent bg-[#2a2245] overflow-hidden">
                    <Avatar userData={userData}></Avatar>
                  </div>
                  <button
                    onClick={() => navigate("/avatar-editor")}
                    className="absolute bottom-0 right-0 p-1.5 bg-accent rounded-full text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-md translate-x-1 translate-y-1"
                  >
                    ✎
                  </button>
                </div>

                {isEditing ? (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered input-xs border-primary/40 font-black text-sm h-auto w-full focus:bg-base-200"
                            value={formData.first_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                first_name: e.target.value,
                              })
                            }
                          />
                          <input
                            type="text"
                            className="input input-bordered input-xs border-primary/40 font-black text-sm h-auto w-full focus:bg-base-200"
                            value={formData.last_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                last_name: e.target.value,
                              })
                            }
                          />
                        </div>

                        <input
                          type="text"
                          className="input input-bordered input-xs border-primary/40 font-black text-sm h-auto w-full focus:bg-base-200"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                        />

                        <input
                          type="text"
                          className="input input-bordered input-primary rounded-full h-6 min-h-0 text-[10px] font-bold uppercase tracking-widest w-24 text-center"
                          value={formData.rank}
                          onChange={(e) =>
                            setFormData({ ...formData, rank: e.target.value })
                          }
                        />
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] uppercase opacity-40 font-black mb-1">
                          Contact
                        </p>
                        <input
                          type="email"
                          className="input input-bordered input-xs border-primary/40 text-sm font-medium h-auto text-right focus:bg-base-200"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="divider my-4"></div>

                    <div className="stats shadow bg-base-200 w-full overflow-visible">
                      <div className="stat py-2 px-4">
                        <div className="stat-title text-[10px] uppercase font-bold">
                          Age
                        </div>
                        <input
                          type="number"
                          className="input input-bordered input-xs border-primary/40 font-bold text-lg text-secondary h-auto w-full focus:bg-base-300"
                          value={formData.age}
                          onChange={(e) =>
                            setFormData({ ...formData, age: e.target.value })
                          }
                        />
                      </div>
                      <div className="stat py-2 px-4 border-l border-base-300">
                        <div className="stat-title text-[10px] uppercase font-bold">
                          Gender
                        </div>
                        <input
                          type="text"
                          className="input input-bordered input-xs border-primary/40 font-bold text-s h-auto w-full focus:bg-base-300 text-secondary"
                          value={formData.gender}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              gender: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-300">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="card-title text-2xl font-black">
                          {userData.first_name} {userData.last_name}
                        </h2>
                        <div className="card-title text-l font-black">
                          {userData.username}
                        </div>
                        <div className="mt-1">
                          <span className="badge badge-primary badge-outline rounded-full px-3 font-bold text-[10px] uppercase tracking-widest">
                            {userData.rank}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase opacity-40 font-black tracking-tighter">
                          Contact
                        </p>
                        <p className="text-sm font-medium">{userData.email}</p>
                      </div>
                    </div>

                    <div className="divider my-4"></div>

                    <div className="stats shadow bg-base-200 w-full">
                      <div className="stat py-2 px-4">
                        <div className="stat-title text-[10px] uppercase font-bold">
                          Age
                        </div>
                        <div className="stat-value text-lg text-secondary">
                          {userData.age}
                        </div>
                      </div>
                      <div className="stat py-2 px-4">
                        <div className="stat-title text-[10px] uppercase font-bold">
                          Gender
                        </div>
                        <div className="stat-value text-lg text-secondary">
                          {userData.gender}
                        </div>
                      </div>
                      <div className="stat py-2 px-4 border-l border-base-300">
                        <div className="stat-title text-[10px] uppercase font-bold">
                          Status
                        </div>
                        <div className="stat-desc text-success font-bold font-mono">
                          ACTIVE
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-6 border-t border-base-200 pt-4">
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-primary btn-sm px-6"
                        onClick={() => edit(userData.id, formData)}
                      >
                        Save Changes
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mt-3 pt-4 border-t border-base-200 flex flex-row justify-between items-end gap-4 w-full">
                        <div className="flex-1">
                          <h3 className="text-[10px] uppercase font-black opacity-40 mb-2 tracking-widest">
                            Groups Joined
                          </h3>

                          <div className="flex flex-wrap gap-1">
                            {groups.map((group, index) => (
                              <span
                                key={index}
                                className="badge badge-ghost badge-sm font-medium whitespace-nowrap"
                              >
                                {group.name}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            className="btn btn-error btn-outline btn-sm px-6"
                            onClick={() => delete_account(userData.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="btn btn-primary btn-sm px-6"
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

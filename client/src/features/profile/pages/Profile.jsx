import ProfileInfo from "../Components/ProfileInfo";
import Trophy from "../Components/Trophy";
import WorkoutHeatmap from "../Components/HeatMap";
import Table from "../Components/Table";
import AvatarSelection from "../Components/AvatarSelection";
import { useAuth } from "../../../app/AuthProvider";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();

  const { id } = useParams();
  const [userData, setUserData] = useState();

  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  // This will be the useEffect to fetch user data from express API.
  useEffect(() => {
    fetch(`http://localhost:8080/users/id/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      });
  }, [user]);

  if (!userData) return <h1>Loading...</h1>;
  return (
    <>
      {userData.is_active === true ? (
        <div className="relative min-h-screen w-full bg-base-300">
          <button
            onClick={handleSignOut}
            className="absolute top-4 right-4 z-49 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-xs font-black uppercase tracking-widest border border-red-500/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            Sign Out
          </button>

          <div className="grid grid-cols-2 grid-rows-2 h-screen w-full bg-base-300 p-6 pt-16 gap-6">
            <div className="row-span-2 h-full flex flex-col gap-6 overflow-y-auto pr-4 scrollbar-hide ">
              <ProfileInfo
                userData={userData}
                setUserData={setUserData}
              ></ProfileInfo>
              <Trophy userData={userData} setUserData={setUserData}></Trophy>
            </div>
            <WorkoutHeatmap userData={userData}></WorkoutHeatmap>
            <Table userData={userData}></Table>
            {/* <AvatarSelection></AvatarSelection> */}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-10 bg-base-200 rounded-3xl border-2 border-dashed border-base-300">
          <h1 className="text-2xl font-black opacity-20 uppercase tracking-widest">
            Account Deactivated
          </h1>
          <p className="text-sm opacity-40">
            Contact an administrator to reactivate this profile.
          </p>
          <button
            onClick={handleSignOut}
            className=" mt-4 z-50 px-4 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 text-xs font-black uppercase tracking-widest border border-red-500/20 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

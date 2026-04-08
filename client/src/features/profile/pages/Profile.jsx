import ProfileInfo from "../Components/ProfileInfo";
import Trophy from "../Components/Trophy";
import WorkoutHeatmap from "../Components/HeatMap";
import { useAuth } from "../../../app/AuthProvider";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { user } = useAuth();

  const { id } = useParams();
  const [userData, setUserData] = useState();

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
      <div className="grid grid-cols-2 grid-rows-2 h-screen w-full bg-base-300 p-6 ">
        <div className="row-span-2 h-full flex flex-col gap-6 overflow-y-auto pr-4 scrollbar-hide ">
          <ProfileInfo
            userData={userData}
            setUserData={setUserData}
          ></ProfileInfo>
          <Trophy userData={userData} setUserData={setUserData}></Trophy>
        </div>
        <WorkoutHeatmap userData={userData}></WorkoutHeatmap>
      </div>
    </>
  );
}

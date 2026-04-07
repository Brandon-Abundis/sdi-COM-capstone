import ProfileInfo from "../Components/ProfileInfo";
import Trophy from "../Components/Trophy";

import { useState, useEffect, useReducer } from "react";

export default function Profile() {
  const [userData, setUserData] = useState({
    id: 1,
    is_admin: false,
    first_name: "First",
    last_name: "Last",
    password: "password",
    email: "email",
    rank: "rank",
    gender: "gender",
    age: 2,
    xp: 4000,
    updated_at: "time_stamp",
    badges: [
      "https://img.daisyui.com/images/profile/demo/batperson@192.webp",
      "https://img.daisyui.com/images/profile/demo/yellingwoman@192.webp",
    ],
    groups: ["group1", "group2"],
    titles: ["the best", "the sprinter", "beast"],
  });

  // This is the edit account functionality that currently doesn't work because the data strucutre doesn't exists yet.

  //   This will be the useEffect to fetch user data from express API.
  // useEffect(() => {
  //   fetch(`http://localhost:8080/user/${id}`)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       return setUserData(data);
  //     });
  // }, []);

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
      </div>
    </>
  );
}

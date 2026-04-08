import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Table({ userData }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/user_workouts/id/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
      });
  }, [userData.id]);

  if (!workouts)
    return <div className="p-10 text-white/20 font-bold">Loading...</div>;
  return <>Stats table will be here</>;
}

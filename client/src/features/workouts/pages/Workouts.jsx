import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState(null);
  let [allInfo, setAllInfo] = useState([]);
  let defaultString = "N/A";
  let [maxLen, setMaxLen] = useState(0)
  let currentUser = JSON.parse(localStorage.getItem("user")).email;
  console.log("start... up !");

  useEffect(() => {
    fetch("http://localhost:8080/users/")
      .then((data) => data.json())
      .then((data) =>
        data.forEach((user) => {
          if (user.email == currentUser) {
            fetch(`http://localhost:8080/users/user_workouts/id/${user.id}`)
              .then((data) => data.json())
              .then((dataArray) => {
                setMaxLen(dataArray.length)
                dataArray.forEach((data) => {
                  let {
                    name,
                    type,
                    time,
                    distance,
                    reps,
                    notes,
                    weight,
                    muscle_groups,
                  } = data;

                  let currentData = {
                  id: allInfo.length + 1,
                  title: name || defaultString,
                  type: type || defaultString,
                  time: time || defaultString,
                  distance: distance || defaultString,
                  reps: reps || defaultString,
                  muscle_groups: muscle_groups || defaultString,
                  weight: weight || defaultString,
                  notes: notes || defaultString,
                }
                setAllInfo(prev => [...prev, currentData])
                });


              });
          }
        }),
      );
  }, []);

  let info = {
    id: 1,
    title: "thisisaTest thisisaTest",
    type: "strength",
    time: "45",
    distance: "N/A",
    reps: "375",
    muscle_groups: "Arms !",
    weight: "100",
    notes: "test note !",
  };

  if (maxLen === null || allInfo.length !== maxLen ) {
    return <h2> Loading :3 </h2>;
  }
  return (
    <div>
      <div>
        <h1 className={"text-[#7c3aed]"}> Your Workouts !</h1>
      </div>
      <div id={"workoutArea"} className={"p-4 grid grid-cols-4"}>
        <AddWorkout
          onClick={() => {
            setEditInfo({
              title: defaultString,
              type: defaultString,
              time: defaultString,
              distance: defaultString,
              reps: defaultString,
              muscle_groups: defaultString,
              weight: defaultString,
              notes: defaultString,
            });
            setShowModal(true);
          }}
        />

        {allInfo.map((elem) => {
          console.log(elem)
          return <WorkoutBox
          details={elem}
          onClick={() => {
            setEditInfo(allInfo[elem.id])
            setShowModal(true);
          }}
        />
        })}


        <Modal
          openModal={showModal}
          closeModal={() => setShowModal(false)}
          info={editInfo}
          key={"new"}
        />
      </div>
    </div>
  );
}



import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import { useState, useEffect } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState(null);
  let [allInfo, setAllInfo] = useState([]);
  let empty = "";
  let defaultString = "N/A";
  let [maxLen, setMaxLen] = useState(0);
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
                setMaxLen(dataArray.length);
                dataArray.forEach((data, index) => {
                  let {
                    name,
                    type,
                    time,
                    distance,
                    reps,
                    notes,
                    weight,
                    muscle_groups,
                    id
                  } = data;

                  let currentData = {
                    id: id,
                    title: name || defaultString,
                    type: type || defaultString,
                    time: time || defaultString,
                    distance: distance || defaultString,
                    reps: reps || defaultString,
                    muscle_groups: muscle_groups || defaultString,
                    weight: weight || defaultString,
                    notes: notes || defaultString,
                  };
                  setAllInfo((prev) => [...prev, currentData]);
                });
              });
          }
        }),
      );
  }, []);

  let info = {
    id: 10000,
    title: "thisisaTest thisisaTest",
    type: "strength",
    time: "45",
    distance: "N/A",
    reps: "375",
    muscle_groups: "Arms !",
    weight: "100",
    notes: "test note !",
  };

  if (maxLen === null || allInfo.length !== maxLen) {
    return <h2> Loading :3 </h2>;
  }
  return (
    <div>
      <div>
        <h1 className={"text-3xl font-bold text-[#7c3aed] mb-6 ml-7 mt-6 tracking-wide"}>
          {" "}
          WORKOUTS{" "}
        </h1>
      </div>
      <div id={"workoutArea"} className={"p-4 grid grid-cols-4"}>
        <AddWorkout
          onClick={() => {
            setEditInfo({
              title: empty,
              type: empty,
              time: empty,
              distance: empty,
              reps: empty,
              muscle_groups: empty,
              weight: empty,
              notes: empty,
            });
            setShowModal(true);
          }}
        />

        {allInfo.map((elem, index) => {
          return (
            <WorkoutBox
              details={elem}
              onClick={() => {
                console.log(elem);
                setEditInfo(allInfo[index]);
                setShowModal(true);
              }}
              key={index}
            />
          );
        })}
      
        <Modal
          openModal={showModal}
          closeModal={() => setShowModal(false)}
          info={editInfo}
          key={"new"}
        />
        <WorkoutBox details={info} onClick={() => {
          setEditInfo(info);
          setShowModal(true);
        }}/>
      </div>
    </div>
  );
}

import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import ModalContent from "../components/ModalContent";
import { useState, useEffect } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState([]);

  let info = { title: "thisisaTest thisisaTest", type: "strength" };
  let info2 = { title: "thisisaTest2 thisisaTest2", type: "cardio" };
  let info3 = { title: "thisisaTest3 thisisaTest3", type: "other" };

  return (
    <div>
      <div>
        <h1 className={"text-[#7c3aed]"}> Your Workouts !</h1>
      </div>
      <div id={"workoutArea"} className={"p-4 grid grid-cols-4"}>
        <AddWorkout
          onClick={() => {
            setEditInfo(null);
            setShowModal(true);
          }}
        />
        <WorkoutBox
          details={info}
          onClick={() => {
            setEditInfo(info);
            console.log(info);
            setShowModal(true);
          }}
        />
        <WorkoutBox
          details={info2}
          onClick={() => {
            setEditInfo(info2);
            console.log(info2);
            setShowModal(true);
          }}
        />
        <WorkoutBox
          details={info3}
          onClick={() => {
            setEditInfo(info3);
            console.log(info3);
            setShowModal(true);
          }}
        />
        <Modal
          openModal={showModal}
          closeModal={() => setShowModal(false)}
          info={editInfo}
        />
      </div>
    </div>
  );
}

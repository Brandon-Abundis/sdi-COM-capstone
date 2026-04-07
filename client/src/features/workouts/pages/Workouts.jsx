import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import ModalContent from "../components/ModalContent";
import { useState } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState(null);

  let info = { title: "thisisaTest thisisaTest", type: "strength" };
  return (
    <div>
      <div>
        <h1 className={"text-[#7c3aed]"}> Your Workouts !</h1>
      </div>
      <div id={"workoutArea"} className={"p-4 grid grid-cols-4"}>
        <AddWorkout onClick={() => setShowModal(true)} />
          <Modal openModal={showModal} closeModal={() => setShowModal(false)}>
            <ModalContent />
          </Modal>
        <WorkoutBox info={info} />
        <WorkoutBox info={info} />
        <WorkoutBox info={info} />
        <WorkoutBox info={info} />
        <WorkoutBox info={info} />
        <WorkoutBox info={info} />
      </div>
    </div>
  );
}

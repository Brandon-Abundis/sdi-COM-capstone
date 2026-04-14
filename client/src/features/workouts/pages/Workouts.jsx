import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import Tab from "../components/Tab";
import "../styles/Workouts.css"
import { useState, useEffect, useRef } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState(null);
  let [allInfo, setAllInfo] = useState([]);
  let [tab, setTab] = useState(null);
  let progressRef = useRef(null)
  let completeRef = useRef(null)
  let tabClicked =
    "font-bold hover:bg-gray-500 bg-purple-500 cursor-pointer p-4  border-2 rounded-md";
  let def = "font-bold hover:bg-gray-500 bg-purple-500 cursor-pointer p-4  border-2 rounded-md"
  let dateWeekAgo = new Date(); // right flippin now
  dateWeekAgo.setDate(dateWeekAgo.getDate() - 7); // right flippin a week ago
  console.log(dateWeekAgo);
  let empty = "";
  let defaultString = "N/A";
  let defaultNum = 10;
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
                    muscle_group,
                    id,
                    created_at,
                  } = data;

                  let currentData = {
                    id: index,
                    title: name || defaultString,
                    type: type || defaultString,
                    time: Math.floor(time / 60 + 0.5) || defaultNum,
                    distance: distance || defaultNum,
                    reps: reps || defaultNum,
                    muscle_group: muscle_group || defaultString,
                    weight: weight || defaultNum,
                    notes: notes || defaultString,
                    created_at: new Date(created_at),
                    storedId: id,
                  };
                  setAllInfo((prev) => [...prev, currentData]);
                  // put all in all table anyway


                });
              });
          }
        }),
      );
  }, []);

  if (maxLen === null || allInfo.length !== maxLen) {
    return <h2> Loading ! </h2>;
  }

  let filtered =
    tab == "Completed"
      ? allInfo.filter((elem) => elem.created_at < dateWeekAgo)
      : tab == "In Progress"
        ? allInfo.filter((elem) => elem.created_at >= dateWeekAgo)
        : allInfo;

  filtered = filtered.sort((a, b) => b.created_at - a.created_at)

  return (
    <div>
      <div>
        <h1
          className={
            "text-3xl font-bold text-primary mb-6 ml-7 mt-6 tracking-wide"
          }
        >
          {" "}
          WORKOUTS{" "}
        </h1>
      </div>
      <div className={"flex justify-center gap-2"}>
        {/*--------------------------------- TABS RIGHT HERE ---------------------------------*/}
        <Tab
        ref={progressRef}
          name={"In Progress"}
          func={() => {
            let currentTab = tab
            setTab(currentTab != "In Progress" ? "In Progress" : null);

            if (currentTab != "In Progress") {
              progressRef.current.id = "chosenTab"
              completeRef.current.id = ""
            } else {
              progressRef.current.id = ""
            }
          }}
        />
        <Tab
          ref={completeRef}
          name={"Completed"}
          func={() => {
            let currentTab = tab
            setTab(currentTab != "Completed" ? "Completed" : null);

            if (currentTab != "Completed") {
              completeRef.current.id = "chosenTab"
              progressRef.current.id = ""
            } else {
              completeRef.current.id = ""
            }
          }}
        />
        {/*--------------------------------- TABS STILL RIGHT HERE ---------------------------------*/}
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
              muscle_group: empty,
              weight: empty,
              notes: empty,
              // title: empty,
              // type: empty,
              // time: empty,
              // distance: empty,
              // reps: empty,
              // muscle_group: empty,
              // weight: empty,
              // notes: empty,
              // git is being a goobr and forcing me to have this
            });
            setShowModal(true);
          }}
        />

        {filtered.map((elem, index) => {
          return (
            <WorkoutBox
              details={elem}
              onClick={() => {
                console.log(elem);
                setEditInfo(filtered[index]);
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
          key={editInfo?.storedId ?? "new"}
          // need key to be dynamic, or saves to unrelated components will remain
        />
      </div>
    </div>
  );
}

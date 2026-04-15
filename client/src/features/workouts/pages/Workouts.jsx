import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
import Modal from "../components/Modal";
import Tab from "../components/Tab";
import "../styles/WorkoutTabs.css";
import { useState, useEffect, useRef } from "react";

export default function Workouts() {
  let [showModal, setShowModal] = useState(false);
  let [editInfo, setEditInfo] = useState(null);
  let [allInfo, setAllInfo] = useState([]);
  let [tab, setTab] = useState(null);
  let progressRef = useRef(null);
  let completeRef = useRef(null);
  let dateTwoDayAgo = new Date(); // right flippin now
  dateTwoDayAgo.setDate(dateTwoDayAgo.getDate() - 5); // right flippin a week ago
  let empty = "";
  const imOld = "1800-01-01T00:00:00.001Z";
  let defaultString = "N/A";
  let defaultNum = 10;
  let maxLen = 30
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
                    updated_at,
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
                    updated_at: new Date(updated_at),
                    storedId: id,
                  };
                  if (!currentData.title.includes(imOld)) {
                  setAllInfo((prev) => [...prev, currentData]);
                  // cant do length check here since setState is async

                  }
                  // put all in all table anyway
                });
              });
          }
        }),
      );
  }, []);

  if (maxLen === null) {
    return <h2> Loading ! </h2>;
  }

  let filtered =
    tab == "Completed"
      ? allInfo.filter((elem) => elem.updated_at < dateTwoDayAgo)
      : tab == "In Progress"
        ? allInfo.filter((elem) => elem.updated_at >= dateTwoDayAgo)
        : allInfo;

  filtered = filtered.sort((a, b) => b.updated_at - a.updated_at);
  return (
    <div className="min-h-screen bg-base-100 p-4">
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
            let currentTab = tab;
            setTab(currentTab != "In Progress" ? "In Progress" : null);

            if (currentTab != "In Progress") {
              progressRef.current.id = "chosenTab";
              completeRef.current.id = "";
            } else {
              progressRef.current.id = "";
            }
          }}
        />
        <Tab
          ref={completeRef}
          name={"Completed"}
          func={() => {
            let currentTab = tab;
            setTab(currentTab != "Completed" ? "Completed" : null);

            if (currentTab != "Completed") {
              completeRef.current.id = "chosenTab";
              progressRef.current.id = "";
            } else {
              completeRef.current.id = "";
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
            });
            setShowModal(true);
          }}
        />

        {filtered.map((elem, index) => {

          if (index > 30) {
            return;
          }
          return (
            <WorkoutBox
              details={elem}
              onClick={() => {
                console.log(elem);
                setEditInfo(filtered[index]);
                setShowModal(true);
              }}
              key={index}
              completed={elem.updated_at < dateTwoDayAgo}
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

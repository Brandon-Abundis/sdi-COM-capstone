import InputField from "./InputField";
import Button from "./Button";
import { useState, useRef } from "react";

export default function ModalContent({ cancel, info }) {
  let id = JSON.parse(localStorage.getItem("user")).id;

  let {
    title,
    type,
    time,
    distance,
    notes,
    reps,
    muscle_group,
    weight,
    storedId,
  } = info
    ? info
    : {
        title: "",
        type: "",
        time: "",
        distance: "",
        reps: "",
        notes: "",
        weight: "",
      };

  let empty = {
    title: title || "",
    type: type || "",
    time: time || "",
    distance: distance || "",
    reps: reps || "",
    muscle_group: muscle_group || "",
    weight: weight || "",
    notes: notes || "",
  };

  let [data, setData] = useState(empty);
  // data is going to be used dont delete yet pwease :3

  let titleRef = useRef();
  let typeRef = useRef();
  let timeRef = useRef();
  let distRef = useRef();
  let repRef = useRef();
  let muscRef = useRef();
  let weightRef = useRef();
  let noteRef = useRef();


  const submit = () => {
    if (titleRef.current?.value == "" || titleRef.current?.value == undefined) {
      titleRef.current.value = "SET A TITLE";
      return;
    }

    const payload = {
      ...data,
      name: titleRef.current?.value,
      type: typeRef.current?.value,
      time: timeRef.current?.value * 60,
      distance: distRef.current?.value,
      reps: repRef.current?.value,
      muscle_group: muscRef.current?.value,
      weight: weightRef.current?.value,
      notes: noteRef.current?.value,
      user_id: Number(id),
    };

    // setData(payload); // potentially do not want this line

    if (storedId) {
      // editing

      fetch(`http://localhost:8080/users/user_workouts/update/id/${storedId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));

      return;
    } else {
      // creating

      fetch("http://localhost:8080/users/user_workouts/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.error(err));

      return;
    }
  };

  return (
    <div
      className={
        "bg-[#6045cd]/0 w-3xl h-200 flex flex-col rounded-lg items-center"
      }
    >
      <h2 className={"text-3xl font-bold text-[#7c3aed] mb-5 tracking-wide"}>
        {" "}
        {title != "" ? "Edit Workout" : "Create Workout"}{" "}
      </h2>
      <div
        id="inputList"
        className={
          "border-2 border-[#1e1838] rounded-lg gap-2 bg-[#16112a] w-160 h-200 flex flex-col items-center justify-center text-[#a78bfa] font-bold "
        }
      >
        {storedId ? <h3> workoutID: {storedId} </h3> : <h3>- No ID yet -</h3>}
        <h2> Title </h2>
        <InputField ref={titleRef} style={"Title"} def={title} />
        <h2> Type </h2>
        <InputField
          ref={typeRef}
          style={"selection"}
          choices={[
            "strength",
            "hypertrophy",
            "power",
            "cardio",
            "core",
            "other",
          ]}
          chosen={type}
        />
        <h2> Time Estimate (Min.)</h2>
        <InputField ref={timeRef} style={"Time Estimate (Min.)"} def={time} />
        <h2> Distance </h2>
        <InputField ref={distRef} style={"Distance"} def={distance} />
        <h2> Reps </h2>
        <InputField ref={repRef} style={"Reps"} def={reps} />
        <h2> Muscle Group </h2>
        <InputField ref={muscRef} style={"Muscle Group"} def={muscle_group} />
        <h2> Weight </h2>
        <InputField ref={weightRef} style={"Weight"} def={weight} />
        <h2> Notes </h2>
        <InputField ref={noteRef} style={"Notes"} def={notes} />
      </div>
      <div className={"w-35 flex justify-between"}>
        <Button name={"Submit"} func={() => submit()} />
        <Button
          name={"Close"}
          func={() => {
            // setData(empty);

            cancel();
          }}
        />
      </div>
    </div>
  );
}

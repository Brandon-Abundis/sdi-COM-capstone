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

  let titleRef = useRef();
  let typeRef = useRef();
  let timeRef = useRef();
  let distRef = useRef();
  let repRef = useRef();
  let muscRef = useRef();
  let weightRef = useRef();
  let noteRef = useRef();

  const submit = () => {
    let ress = document.querySelector("#listen");
    if (
      titleRef.current?.value == "" ||
      titleRef.current?.value == undefined ||
      titleRef.current?.value == "SET A TITLE"
    ) {
      titleRef.current.value = "SET A TITLE";
      return;
    }

    const payload = {
      ...data,
      name: titleRef.current?.value,
      type: typeRef.current?.value,
      time: timeRef.current?.value * 60 || 600,
      distance: distRef.current?.value || "N/A",
      reps: repRef.current?.value || 10,
      muscle_group: muscRef.current?.value || "N/A",
      weight: weightRef.current?.value || 10,
      notes: noteRef.current?.value || "N/A",
      user_id: Number(id),
    };

    if (storedId) {
      fetch(`http://localhost:8080/users/user_workouts/update/id/${storedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => {
          setTimeout(() => window.location.reload(), 2000);
          ress.innerHTML = "Saved! Reloading the page...";
        })
        .catch((err) => console.error(err));
      return;
    } else {
      fetch("http://localhost:8080/users/user_workouts/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then(() => setTimeout(() => window.location.reload(), 2000))
        .catch((err) => console.error(err));
      return;
    }
  };

  return (
    <div className="bg-transparent w-3xl h-200 flex flex-col rounded-lg items-center">
      <h2
        id="listen"
        className="text-3xl font-bold text-primary mb-5 tracking-wide"
      >
        {title != "" ? "Edit Workout" : "Create Workout"}
      </h2>

      <div
        id="inputList"
        className="border-2 border-base-300 rounded-lg gap-2 bg-base-200 w-160 h-200 flex flex-col items-center justify-center text-secondary font-bold"
      >
        {storedId ? (
          <h3 className="text-base-content/50 text-xs"> Workout ID: {storedId} </h3>
        ) : (
          <h3 className="text-base-content/30 text-xs">— New Workout —</h3>
        )}

        <h2> Title </h2>
        <InputField ref={titleRef} style={"Title"} def={title} />
        <h2> Type </h2>
        <InputField
          ref={typeRef}
          style={"selection"}
          choices={["strength", "hypertrophy", "power", "cardio", "core", "other"]}
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
        <div className="w-35 flex justify-between">
          <Button name={"Submit"} func={() => submit()} />
          <Button name={"Close"} func={() => cancel()} />
        </div>
      </div>
    </div>
  );
}

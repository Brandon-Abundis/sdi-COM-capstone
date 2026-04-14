import InputField from "./InputField";
import Button from "./Button";
import { useState, useRef } from "react";

export default function ModalContent({ cancel, info }) {
  let id = JSON.parse(localStorage.getItem("user")).id;

  const throwError = (elem, type) => {
    elem.innerHTML = type ? "Check all Fields & Try Again" : "Internal Server Error; Check All Fields & Try Again";
    elem.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    elem.style.color = "red";
    elem.style.fontSize = "25px";
    setTimeout(() => {
      elem.style.color = "";
      elem.style.fontSize = "";
      elem.innerHTML = storedId ? "Edit Workout" : "Create Workout";
    }, 5000);
  };

  const progress = (elem) => {
    setTimeout(() => window.location.reload(), 2000);
    elem.innerHTML = "Saved! Reloading the page...";
    elem.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

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
    created_at,
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
      titleRef.current?.value == undefined
    ) {
      throwError(ress, 'local')
      return;
    }

    const payload = {
      ...data,
      name: titleRef.current?.value,
      type: typeRef.current?.value,
      time: timeRef.current?.value * 60,
      distance: distRef.current?.value || "N/A",
      reps: repRef.current?.value,
      muscle_group: muscRef.current?.value || "N/A",
      weight: weightRef.current?.value,
      notes: noteRef.current?.value || "N/A",
      user_id: Number(id),
    };
    console.log(payload)
    if (isNaN(payload.time) || isNaN(payload.distance) || isNaN(reps) || isNaN(weight)) {
      throwError(ress, "local")
      return;
    }

    if (storedId) {
      fetch(`http://localhost:8080/users/user_workouts/update/id/${storedId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.status == 500) {
            throwError(ress);
            return;
          }
          return res.json();
        })
        .then(() => {
         progress(ress);
        })
        .catch((err) => console.error(err));
      return;
    } else {
      fetch("http://localhost:8080/users/user_workouts/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (res.status == 500) {
            throwError(ress);
            return;
          }
          return res.json();
        })
        .then(() => {
          progress(ress);
        })
        .catch((err) => console.error(err));
      return;
    }
  };

  return (
    <div className="bg-transparent w-3xl h-200 flex flex-col rounded-lg items-center">
      <div
        id="inputList"
        className="border-2 border-base-300 rounded-lg gap-2 bg-base-200 w-160 h-240 flex flex-col items-center justify-center text-secondary font-bold"
      >
        <h2
          id="listen"
          className="text-3xl font-bold text-primary mb-5 tracking-wide"
        >
          {title != "" ? "Edit Workout" : "Create Workout"}
        </h2>
        {storedId ? (
          <h3 className="text-base-content/50 text-xs">
            {" "}
            Workout ID: {storedId}{" "}
          </h3>
        ) : (
          <h3 className="text-base-content/30 text-xs">— New Workout —</h3>
        )}

        {created_at ? (
          <h3 className="text-base-content/50 text-xs">
            {" "}
            Time Created: {created_at.toDateString()}{" "}
          </h3>
        ) : (
          <h3 className="text-base-content/30 text-xs">— No Date Yet —</h3>
        )}

        <h2> Title</h2>
        <InputField ref={titleRef} style={"Title"} def={title} />
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
        <h2> Distance (Mi.)</h2>
        <InputField ref={distRef} style={"Distance (Mi.)"} def={distance} />
        <h2> Reps </h2>
        <InputField ref={repRef} style={"Reps"} def={reps} />
        <h2> Muscle Group </h2>
        <InputField ref={muscRef} style={"Muscle Group"} def={muscle_group} />
        <h2> Weight (lbs.)</h2>
        <InputField ref={weightRef} style={"Weight (lbs.)"} def={weight} />
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

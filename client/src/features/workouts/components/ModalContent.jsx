import InputField from "./InputField";
import Button from "./Button";
import { useState, useRef } from "react";

export default function ModalContent({ cancel, info }) {
  let {
    title,
    type,
    time,
    distance,
    notes,
    reps,
    muscle_groups,
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

  let [data, setData] = useState({
    title: title || "",
    type: type || "",
    time: time || "",
    distance: distance || "",
    reps: reps || "",
    muscle_groups: muscle_groups || "",
    weight: weight || "",
    notes: notes || "",
  });
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
    // implement a check that certain required fields are filled out
    if (titleRef.current?.value == "" || titleRef.current?.value == undefined) {
      titleRef.current.value = "SET A TITLE";
      return;
    }

    setTimeout(
      setData({
        ...data,
        title: titleRef.current?.value,
        type: typeRef.current?.value,
        time: timeRef.current?.value,
        distance: distRef.current?.value,
        reps: repRef.current?.value,
        muscle_groups: muscRef.current?.value,
        weight: weightRef.current?.value,
        notes: noteRef.current?.value,
      }),
      2000,
    );
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
        <h2> Muscle Groups </h2>
        <InputField ref={muscRef} style={"Muscle Groups"} def={muscle_groups} />
        <h2> Weight </h2>
        <InputField ref={weightRef} style={"Weight"} def={weight} />
        <h2> Notes </h2>
        <InputField ref={noteRef} style={"Notes"} def={notes} />
      </div>
      <div className={"w-35 flex justify-between"}>
        <Button name={"Submit"} func={() => submit()} />
        <Button name={"Cancel"} func={() => cancel()} />
      </div>
    </div>
  );
}

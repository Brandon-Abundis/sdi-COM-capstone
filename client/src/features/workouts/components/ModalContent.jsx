import InputField from "./InputField";
import { useState } from "react";

export default function ModalContent({ cancel, info }) {
  let { title, type, time, distance, notes, reps, muscle_groups, weight } = info
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
    location: distance || "",
    reps: reps || "",
    muscle_groups: muscle_groups || "",
    weight: weight || "",
    notes: notes || "",
  });
  // data is going to be used dont delete yet pwease :3

  return (
    <div
      className={
        "bg-[#6045cd] w-3xl h-200 flex flex-col rounded-lg items-center "
      }
    >
      <h2> {info ? "Edit Workout" : "Create Workout"} </h2>
      <div
        id="inputList"
        className={
          "border-2 border-[#110a2f] rounded-lg gap-2 bg-[#2d2062] w-160 h-160 flex flex-col items-center justify-center"
        }
      >
        <h2> Title </h2>
        <InputField style={"Title"} def={title} />
        <h2> Type </h2>
        <InputField
          style={"selection"}
          choices={["strength", "hypertrophy", "power", "cardio", "other"]}
          chosen={type}
        />
        <h2> Time Estimate (Min.)</h2>
        <InputField style={"Time Estimate (Min.)"} def={time} />
        <h2> Distance </h2>
        <InputField style={"Distance"} def={distance} />
        <h2> Reps </h2>
        <InputField style={"Reps"} def={reps} />
        <h2> Muscle Groups </h2>
        <InputField style={"Muscle Groups"} def={muscle_groups} />
        <h2> Weight </h2>
        <InputField style={"Weight"} def={weight} />
        <h2> Notes </h2>
        <InputField style={"Notes"} def={notes} />
      </div>
      <button
        onClick={() => {
          cancel();
        }}
        className={
          "bg-white text-gray-900 w-15 rounded-md hover:bg-gray-500 active:scale-90 border-gray-600 border mt-3"
        }
      >
        {" "}
        Cancel
      </button>
    </div>
  );
}

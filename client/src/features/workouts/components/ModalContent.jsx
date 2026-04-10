import InputField from "./InputField";
import { useState } from "react";

export default function ModalContent({ cancel, info }) {
  let { id, title, type, time, distance, notes, reps, muscle_groups, weight } =
    info
      ? info
      : {
          id: -1, // change later when more POST/PATCH/DELETE added
          title: "",
          type: "",
          time: "",
          distance: "",
          reps: "",
          notes: "",
          weight: "",
        };

  let [data, setData] = useState({
    id: id || -1,
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
          "bg-[#6045cd]/0 w-3xl h-200 flex flex-col rounded-lg items-center"
        }
      >
        <h2 className={"text-3xl font-bold text-[#7c3aed] mb-5 tracking-wide"}>
          {" "}
          {title != "" ? "Edit Workout" : "Create Workout"}{" "}
        </h2>
        <div
          id="inputList"
          style={{
            backgroundColor: "var(--app-bg-200)",
            borderColor: "var(--app-border)",
            color: "var(--app-text-secondary)",
          }}
          className="border-2 rounded-lg gap-2 w-160 h-200 flex flex-col items-center justify-center font-bold"
        >
          <h2> Title </h2>
          <InputField style={"Title"} def={title} />
          <h2> Type </h2>
          <InputField
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
          style={{
            backgroundColor: "var(--app-bg-400)",
            color: "var(--app-text-main)",
            borderColor: "var(--app-border)",
          }}
          className="w-15 rounded-md hover:opacity-80 active:scale-90 border mt-3"
        >
          {" "}
          Cancel
        </button>
      </div>
  );
}

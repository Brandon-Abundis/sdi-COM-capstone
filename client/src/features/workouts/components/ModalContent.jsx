import InputField from "./InputField";
import Button from "./Button";
import { useRef } from "react";

export default function ModalContent({ cancel, info }) {
  let id = JSON.parse(localStorage.getItem("user")).id;

  const numberCheck = (num) => {
    if (num !== "" && isNaN(num)) {
      return true;
    }

    return false;
  };

  const throwError = (elem, type) => {
    setTimeout(
      () =>
        elem.scrollIntoView({
          behavior: "smooth",
          block: "center",
        }),
      50,
    );

    elem.innerHTML = type
      ? "Check all Fields & Try Again"
      : "Internal Server Error; Check All Fields & Try Again";

    elem.style.color = "red";
    elem.style.fontSize = "25px";
    setTimeout(() => {
      elem.style.color = "";
      elem.style.fontSize = "";
      elem.innerHTML = storedId ? "Edit Workout" : "Create Workout";
    }, 5000);
  };

  const progress = (elem) => {
    setTimeout(() => window.location.reload(), 1750);
    elem.innerHTML = "Saved! Reloading the page...";
    elem.style.color = "";

    setTimeout(
      elem.scrollIntoView({
        behavior: "smooth",
        block: "center",
      }),
      50,
    );
  };

  const pseudoDel = () => {
    let ress = document.querySelector("#listen");
    const imOld = "1800-01-01T00:00:00.001Z";
    // what a sad day
    // i can't set the date to 1800 jan 1 D: D: D:
    // wait i have a better idea >:3
    const rewriteDate = {
      name: `${titleRef.current?.value} - ${imOld}`,
      type: typeRef.current?.value,
      time: -1,
      distance: -1,
      reps: -1,
      muscle_group: "Removed",
      weight: -1,
      notes: "Removed",
      user_id: Number(id),
    };
    fetch(`http://localhost:8080/users/user_workouts/update/id/${storedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rewriteDate),
    })
      .then((data) => {
        console.log(`status: ${data.status}`);
        return data.json();
      })
      .then((data) => console.log(data));

    progress(ress);
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
    updated_at,
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
  let fiveDayAgo = new Date();
  fiveDayAgo.setDate(fiveDayAgo.getDate() - 5);
  const tooOld = updated_at < fiveDayAgo;
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
    if (titleRef.current?.value == "" || titleRef.current?.value == undefined) {
      throwError(ress, "local");
      return;
    }

    const payload = {
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
    if (
      numberCheck(payload.time) ||
      numberCheck(payload.distance) ||
      numberCheck(payload.reps) ||
      numberCheck(payload.weight)
    ) {
      throwError(ress, "local");
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
        className="border-2 border-base-300 rounded-lg gap-2 bg-base-200 w-160 h-260 flex flex-col items-center justify-center text-secondary font-bold"
      >
        <h2
          id="listen"
          className="text-3xl font-bold text-primary mb-5 tracking-wide"
        >
          {storedId && tooOld
            ? "View Workout"
            : storedId
              ? "Edit Workout"
              : "Create Workout"}
        </h2>
        {storedId ? (
          <h3 className="text-base-content/50 text-xs">
            {" "}
            Workout ID: {storedId}{" "}
          </h3>
        ) : (
          <h3 className="text-base-content/30 text-xs">— New Workout —</h3>
        )}

        {updated_at ? (
          <h3 className="text-base-content/50 text-xs">
            {" "}
            Time Created: {updated_at.toDateString()}{" "}
          </h3>
        ) : (
          <h3 className="text-base-content/30 text-xs">— No Date Yet —</h3>
        )}

        <h2> Title</h2>
        <InputField
          ref={titleRef}
          style={"Title"}
          def={title}
          aged={tooOld}
          maxLen={40}
        />
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
        <h2> Time Estimate (Min.) - # </h2>
        <InputField
          ref={timeRef}
          style={"Time Estimate (Min.)"}
          def={time}
          aged={tooOld}
          maxLen={7}
        />
        <h2> Distance (Mi.) - # </h2>
        <InputField
          ref={distRef}
          style={"Distance (Mi.)"}
          def={distance}
          aged={tooOld}
        />
        <h2> Reps - # </h2>
        <InputField
          ref={repRef}
          style={"Reps"}
          def={reps}
          aged={tooOld}
          maxLen={9}
        />
        <h2> Muscle Group </h2>
        <InputField
          ref={muscRef}
          style={"Muscle Group"}
          def={muscle_group}
          aged={tooOld}
        />
        <h2> Weight (lbs.) - # </h2>
        <InputField
          ref={weightRef}
          style={"Weight (lbs.)"}
          def={weight}
          aged={tooOld}
          maxLen={9}
        />
        <h2> Notes </h2>
        <InputField ref={noteRef} style={"Notes"} def={notes} aged={tooOld} />
        <div className="w-35 flex justify-center gap-2">
          {!tooOld && <Button name={"Submit"} func={() => submit()} />}
          {storedId && !tooOld && (
            <Button name={"Remove"} func={() => pseudoDel()} />
          )}
          <Button name={"Close"} func={() => cancel()} />
        </div>
      </div>
    </div>
  );
}

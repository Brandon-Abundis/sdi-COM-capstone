import "../styles/WorkoutBox.css";
import Icon from "./Icon";

export default function WorkoutBox({ details, onClick }) {
  let { title, type, time, notes } = details;
  title = title.charAt(0).toUpperCase() + title.slice(1) || "";
  let displayType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      onClick={onClick}
      id="WorkoutBox"
      style={{ borderColor: "var(--app-workout-border)" }}
      className="border-2 hover:border-[#ee80ff] hover:scale-105 cursor-pointer active:scale-100"
    >
      <div className="text-lg font-bold rounded-t-lg h-[20%] flex items-center justify-between">
        <h2
          style={{
            backgroundColor: "var(--app-workout-title)",
            borderColor: "var(--app-workout-title-border)",
          }}
          className="ml-2 p-2 rounded-md border-2 w-60 h-18 flex items-center justify-center"
        >
          {title}
        </h2>
        <Icon type={type} />
      </div>
      <div
        style={{ backgroundColor: "var(--app-workout-body)" }}
        className="m-4 w-60 h-49 flex flex-col justify-around rounded-sm"
      >
        <h2 className="text-center mt-1 text-3xl"> {displayType} </h2>
        <h2 className="text-center mt-1"> {time} Min. </h2>
        <h2 className="text-center mt-1"> {notes} </h2>
        <h2
          style={{ backgroundColor: "var(--app-bg-400)" }}
          className="text-center mt-1 w-50 self-center rounded-2xl"
        >
          Click for more details
        </h2>
      </div>
    </div>
  );
}

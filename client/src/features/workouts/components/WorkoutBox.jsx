import "../styles/WorkoutBox.css";
import Icon from "./Icon";

export default function WorkoutBox({ details, onClick, completed }) {
  let { title, type, time, updated_at } = details;
  let fiveDayFromNow = new Date(updated_at);
  fiveDayFromNow.setDate(fiveDayFromNow.getDate() + 5);
  let prettyDate = fiveDayFromNow.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  console.log(prettyDate);
  title = title.charAt(0).toUpperCase() + title.slice(1) || "";
  let displayType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      onClick={onClick}
      id={"WorkoutBox"}
      className="border-2 border-primary/20 hover:border-accent hover:scale-105 cursor-pointer active:scale-90"
    >
      <div className="text-lg font-bold rounded-t-lg h-[20%] flex items-center justify-between">
        <h2
          className={`break-all ml-2 bg-base-100 p-2 rounded-md border-2 border-secondary/50 w-60 h-18 flex items-center justify-center`}
        >
          {title}
        </h2>
        <Icon type={type} />
      </div>
      <div className="m-4 w-60 h-49 bg-base-100 flex flex-col justify-around items-center rounded-md border-secondary/40 border">
        {completed ? (
          <h2
            className={
              "bg-green-600 w-25 p-1 rounded-2xl font-bold border-3 border-green-900 text-sm"
            }
          >
            {" "}
            Completed ✓{" "}
          </h2>
        ) : (
          <h2
            className={
              "bg-gray-500 w-25 p-1 rounded-2xl font-bold border-3 border-gray-900 text-xs"
            }
          >
            Completes on: {prettyDate}
          </h2>
        )}
        <h2 className="text-center mt-1 text-3xl font-bold"> {displayType} </h2>
        <h2 className="text-center mt-1 font-semibold"> {time} Min. </h2>
        <h2 className="text-center mt-1 font-medium">
          {" "}
          {updated_at.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric"
          })}{" "}
        </h2>
        <h2 className="text-center mt-1 bg-base-300 w-50 self-center rounded-2xl">
          {" "}
          Click for more details{" "}
        </h2>
      </div>
    </div>
  );
}

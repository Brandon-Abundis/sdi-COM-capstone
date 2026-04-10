import "../styles/WorkoutBox.css";
import Icon from "./Icon";

export default function WorkoutBox({ details, onClick }) {
  let { title, type, time, notes } = details;
  title = title.charAt(0).toUpperCase() + title.slice(1) || "";
  let displayType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div
      onClick={onClick}
      id={"WorkoutBox"}
      className={
        "border-2 border-[#240014] hover:border-[#ee80ff] hover:scale-105 cursor-pointer active:scale-90"
      }
    >
      <div className="text-lg font-bold rounded-t-lg h-[20%] flex items-center justify-between">
        <h2
          className={
            "ml-2 bg-[#080610] p-2 rounded-md border-2 border-[#aa80f2] w-60 h-18 flex items-center justify-center "
          }
        >
          {title}
        </h2>
        <Icon type={type} />
      </div>
      <div className={"m-4 w-60 h-49 bg-[#080610] flex flex-col justify-around rounded-md border-[#aa80f2] border-1"}>
        <h2 className={"text-center mt-1 text-3xl font-bold"}> {displayType} </h2>
        <h2 className={"text-center mt-1 font-semibold"}> {time} Min. </h2>
        <h2 className={"text-center mt-1 font-medium"}> {notes} </h2>
        <h2 className={"text-center mt-1 bg-black w-50 self-center rounded-2xl"}> Click for more details </h2>
      </div>
    </div>
  );
}

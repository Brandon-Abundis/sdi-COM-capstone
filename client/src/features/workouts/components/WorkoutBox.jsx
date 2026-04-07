import "../styles/WorkoutBox.css";
// importing because tailwind was getting too long D:
import Icon from "./Icon";

export default function WorkoutBox({ details, onClick }) {
  let { title, type } = details;
  return (
    <div
      onClick={onClick}
      id={"WorkoutBox"}
      className={
        "border-2 border-[#240014] hover:border-[#ee80ff] hover:scale-105 cursor-pointer active:scale-100"
      }
    >
      <div
        className={
          "text-lg font-bold rounded-t-lg h-[20%] flex items-center justify-between"
        }
      >
        <h2
          className={
            "ml-2 bg-[#21003d] p-2 rounded-md border-2 border-[#9e65ff] w-60 h-18"
          }
        >
          {title}
        </h2>
        <Icon type={type} />
      </div>
      <div className={"m-4 w-60 h-49 bg-[#220d23]"}>
        <h2 className={"text-center mt-1"}> this is test text</h2>
        <h2 className={"text-center mt-1"}> this is test text</h2>
        <h2 className={"text-center mt-1"}> this is test text</h2>
        <h2 className={"text-center mt-1"}> this is test text</h2>
        <h2 className={"text-center mt-1"}> this is test text</h2>
        <h2 className={"text-center mt-1"}> this is test text</h2>
      </div>
    </div>
  );
}

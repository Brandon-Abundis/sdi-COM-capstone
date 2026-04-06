import "../styles/WorkoutBox.css";
// importing because tailwind was getting too long D:

export default function WorkoutBox() {
  return (
    <div
      id={"WorkoutBox"}
      className={
        "transition-transform duration-750 hover:cursor-pointer hover:scale-120"
      }
    >
      <div
        className={
          "text-lg font-bold rounded-t-lg h-[20%] flex items-center justify-between"
        }
      >
        <h2
          className={
            "ml-2 bg-[#21003d] p-2 rounded-md border-2 border-[#9e65ff]"
          }
        >
          {" "}
          Workout Name
        </h2>
      </div>
      <div>
        <h2 className={"text-center mt-5"}></h2>
      </div>
    </div>
  );
}

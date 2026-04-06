import WorkoutBox from "../components/WorkoutBox";
import AddWorkout from "../components/AddWorkout";
export default function Workouts() {
  return (
    <div>
      <div>
        <h1 className={"text-[#7c3aed]"}> Your Workouts !</h1>
      </div>

      <div id={"workoutArea"} className={"p-4 grid grid-cols-4"}>
        <AddWorkout />
        <WorkoutBox />
        <WorkoutBox />
        <WorkoutBox />
        <WorkoutBox />
        <WorkoutBox />
        <WorkoutBox />
      </div>
    </div>
  );
}

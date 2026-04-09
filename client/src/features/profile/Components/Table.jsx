import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Table({ userData }) {
  const [workouts, setWorkouts] = useState([]);

  const exercises = [
    {
      name: "Back Squat",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Legs",
      unit: "lbs",
    },
    {
      name: "Bench Press",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Chest",
      unit: "lbs",
    },
    {
      name: "Deadlift",
      max: 0,
      reps: 0,
      type: "Power",
      muscle: "Back/Legs",
      unit: "lbs",
    },
    {
      name: "Overhead Press",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Shoulders",
      unit: "lbs",
    },
    {
      name: "Pull-ups",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Back",
      unit: "lbs",
    },
    {
      name: "Bicep Curls",
      max: 0,
      reps: 0,
      type: "Hypertrophy",
      muscle: "Arms",
      unit: "lbs",
    },
    {
      name: "Lunges",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Legs",
      unit: "lbs",
    },
    {
      name: "2-Mile Run",
      max: 0,
      reps: 0,
      type: "Cardio",
      muscle: "Full Body",
      unit: "min/mile",
    },
    {
      name: "1-Minute Push-ups",
      max: 0,
      reps: 0,
      type: "Strength",
      muscle: "Chest",
      unit: "push-ups",
    },
    {
      name: "1-Minute Sit-ups",
      max: 0,
      reps: 0,
      type: "Core",
      muscle: "Abs",
      unit: "sit-ups",
    },
  ];

  useEffect(() => {
    fetch(`http://localhost:8080/users/user_workouts/id/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
      });
  }, [userData.id]);

  function muscleGroupHits(workouts) {
    const hits = {
      Legs: 0,
      Back: 0,
      Chest: 0,
      Shoulders: 0,
      Arms: 0,
      Core: 0,
    };
    workouts.forEach((workout) => {
      if (workout.muscle_group.includes("Back/Legs")) {
        hits.Back++;
        hits.Legs++;
      } else if (workout.muscle_group.includes("Full Body")) {
        Object.keys(hits).forEach((group) => hits[group]++);
      } else if (workout.muscle_group in hits) {
        hits[workout.muscle_group]++;
      }
    });

    return hits;
  }

  function findMax(workouts) {
    workouts.forEach((workout) => {
      for (let i = 0; i < exercises.length; i++) {
        if (workout.name === exercises[i].name) {
          if (workout.weight) {
            if (workout.weight > exercises[i].max) {
              exercises[i].max = workout.weight;
              exercises[i].reps = workout.reps;
            }
          } else if (workout.distance && workout.time) {
            const paceInSeconds = workout.time / workout.distance;

            if (exercises[i].max === 0 || paceInSeconds < exercises[i].max) {
              exercises[i].max = paceInSeconds;
            }
          }
        }
      }
    });
    return exercises;
  }

  if (!workouts)
    return <div className="p-10 text-white/20 font-bold">Loading...</div>;

  const finalStats = findMax(workouts);

  return (
    <div className="bg-[#0f0d17] p-8 rounded-3xl border border-white/5 shadow-2xl flex gap-8 h-full">
      <div className="w-[60%] flex flex-col">
        <div className="mb-6">
          <h2 className="text-white text-xl font-black tracking-tight leading-none">
            Power Stats
          </h2>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            All Time Records
          </p>
        </div>

        <div className="flex-grow overflow-y-auto pr-4 scrollbar-hide">
          <table className="w-full text-left">
            <tbody className="divide-y divide-white/5">
              {finalStats.map((ex, i) => (
                <tr
                  key={i}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4">
                    <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {ex.name}
                    </div>
                    <div className="text-[10px] text-white/30 font-medium uppercase tracking-tighter">
                      {ex.muscle}
                    </div>
                  </td>
                  <td className="py-4 text-right text-white font-black">
                    {ex.max === 0 ? (
                      <span className="text-white/10 italic">---</span>
                    ) : (
                      <div className="flex flex-col items-end leading-none">
                        <span className="text-lg">
                          {ex.name === "2-Mile Run"
                            ? `${Math.floor(ex.max / 60)}:${Math.round(
                                ex.max % 60,
                              )
                                .toString()
                                .padStart(2, "0")}`
                            : ex.max}

                          <span className="text-[10px] ml-1 text-white/40 font-bold uppercase tracking-widest">
                            {ex.name === "2-Mile Run" ? "min/mi" : "lbs"}
                          </span>
                        </span>

                        {ex.name !== "2-Mile Run" && ex.reps > 0 && (
                          <span className="text-[10px] text-blue-400/60 font-bold uppercase mt-1 tracking-tighter">
                            {ex.reps} Reps
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-[40%] flex flex-col border-l border-white/5 pl-8">
        <div className="mb-6">
          <h2 className="text-white text-sm font-black tracking-tight">
            Frequency Distribution
          </h2>
          <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mt-1">
            Sessions per Muscle Group
          </p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 scrollbar-hide space-y-5">
          {Object.entries(muscleGroupHits(workouts)).map(([group, count]) => {
            const maxHits = Math.max(
              ...Object.values(muscleGroupHits(workouts)),
              1,
            );
            const barWidth = (count / maxHits) * 100;

            return (
              <div key={group} className="space-y-1.5">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                  <span className="text-white/40">{group}</span>
                  <span
                    className={count > 0 ? "text-blue-400" : "text-white/10"}
                  >
                    {count} {count === 1 ? "Hit" : "Hits"}
                  </span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
                    style={{ width: `${barWidth}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

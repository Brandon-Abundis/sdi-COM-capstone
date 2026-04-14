import { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

export default function WorkoutHeatmap({ userData }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/users/user_workouts/id/${userData.id}`)
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
      });
  }, [userData.id]);

  const heatmapValues = () => {
    const counts = {};

    const workoutsThisYear = workouts.filter((w) => {
      const workoutYear = new Date(w.created_at);
      return workoutYear >= start && workoutYear <= end;
    });

    workoutsThisYear.forEach((w) => {
      const d = new Date(w.created_at).toISOString().split("T")[0];
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.keys(counts).map((d) => ({ date: d, count: counts[d] }));
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const start = new Date();
  start.setFullYear(today.getFullYear() - 1);
  const end = new Date(today);
  if (!workouts)
    return (
      <div className="p-10 text-base-content/20 font-bold">Loading...</div>
    );

  return (
    <div className="bg-base-100 p-8 rounded-3xl border border-base-content/5 shadow-2xl w-full flex flex-col mb-5">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-base-content text-xl font-black tracking-tight leading-none">
            Yearly Workouts
          </h2>
          <p className="text-base-content/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            The {currentYear} Journey
          </p>
        </div>
        <div className="text-[10px] font-black text-base-content/40 uppercase bg-base-content/5 px-3 py-1 rounded-full border border-base-content/5">
          {heatmapValues().length} Active Days This Year
        </div>
      </div>

      <div className="w-full yearly-heatmap-container">
        <CalendarHeatmap
          startDate={start}
          endDate={end}
          values={heatmapValues()}
          showWeekdayLabels={true}
          gutterSize={1.5}
          classForValue={(v) => {
            if (!v || v.count === 0) return "color-empty";
            return `color-scale-${Math.min(v.count, 4)}`;
          }}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-base-content/5 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-base-content/20 uppercase tracking-tighter">
              0 Workouts
            </span>

            <div className="flex gap-1">
              <div
                className="w-3 h-3 rounded-[2px] bg-base-content/5"
                title="No activity"
              />
              <div
                className="w-3 h-3 rounded-[2px] bg-neutral"
                title="1 workout"
              />
              <div
                className="w-3 h-3 rounded-[2px] bg-secondary"
                title="2 workouts"
              />
              <div
                className="w-3 h-3 rounded-[2px] bg-accent"
                title="3 workouts"
              />
              <div
                className="w-3 h-3 rounded-[2px] bg-primary"
                title="4+ workouts"
              />
            </div>

            <span className="text-[9px] font-bold text-base-content/20 uppercase tracking-tighter">
              4+ Workouts
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .yearly-heatmap-container .react-calendar-heatmap {
          width: 100%;
          height: 100%;
        }

        .yearly-heatmap-container text {
          font-size: 10px;
          fill: rgba(255, 255, 255, 0.15);
          font-weight: 700;
          text-transform: uppercase;
        }

        .react-calendar-heatmap rect {
          rx: 0.8;
          ry: 0.8;
        }

        .react-calendar-heatmap .color-empty {
          fill: rgba(255, 255, 255, 0.05);
        }

        .react-calendar-heatmap .color-scale-1 {
          fill: #2a2245;
        }

        .react-calendar-heatmap .color-scale-2 {
          fill: #a78bfa;
        }

        .react-calendar-heatmap .color-scale-3 {
          fill: #c084fc;
        }

        .react-calendar-heatmap .color-scale-4 {
          fill: #7c3aed;
          filter: drop-shadow(0 0 3px rgba(192, 132, 252, 0.5));
        }
      `}</style>
    </div>
  );
}

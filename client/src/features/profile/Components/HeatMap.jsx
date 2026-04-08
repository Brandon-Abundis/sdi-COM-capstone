import React, { useState, useEffect, useMemo } from "react";
import CalendarHeatmap from "react-calendar-heatmap";

export default function WorkoutHeatmap({ userData }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/users/user_workouts/id/${userData.id}`,
        );
        const data = await response.json();
        setWorkouts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error("Heatmap Fetch Error:", err);
      }
    };
    if (userData.id) fetchWorkouts();
  }, [userData.id]);

  const heatmapValues = useMemo(() => {
    const counts = {};
    workouts.forEach((w) => {
      if (!w.created_at) return;
      const d = new Date(w.created_at).toISOString().split("T")[0];
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.keys(counts).map((d) => ({ date: d, count: counts[d] }));
  }, [workouts]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const start = new Date(currentYear, 0, 1);
  const end = new Date(currentYear, 11, 31);
  if (!workouts)
    return <div className="p-10 text-white/20 font-bold">Loading...</div>;

  return (
    <div className="bg-[#0f0d17] p-8 rounded-3xl border border-white/5 shadow-2xl w-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-white text-xl font-black tracking-tight leading-none">
            Yearly Workouts
          </h2>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            The {currentYear} Journey
          </p>
        </div>
        <div className="text-[10px] font-black text-white/40 uppercase bg-white/5 px-3 py-1 rounded-full border border-white/5">
          {heatmapValues.length} Days Active
        </div>
      </div>

      <div className="w-full yearly-heatmap-container">
        <CalendarHeatmap
          startDate={start}
          endDate={end}
          values={heatmapValues}
          showWeekdayLabels={true}
          gutterSize={1.5}
          classForValue={(v) => {
            if (!v || v.count === 0) return "color-empty";
            return `color-scale-${Math.min(v.count, 4)}`;
          }}
        />
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
        <div className="flex gap-4">
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
              None
            </span>

            <div className="flex gap-1">
              <div
                className="w-3 h-3 rounded-[2px] bg-white/5"
                title="No activity"
              />

              <div
                className="w-3 h-3 rounded-[2px] bg-[#064e3b]"
                title="1 workout"
              />

              <div
                className="w-3 h-3 rounded-[2px] bg-[#059669]"
                title="2 workouts"
              />

              <div
                className="w-3 h-3 rounded-[2px] bg-[#10b981]"
                title="3 workouts"
              />

              <div
                className="w-3 h-3 rounded-[2px] bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                title="4+ workouts"
              />
            </div>

            <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">
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

        .react-calendar-heatmap .color-empty { fill: rgba(255, 255, 255, 0.03); }
        .react-calendar-heatmap .color-scale-1 { fill: #064e3b; }
        .react-calendar-heatmap .color-scale-2 { fill: #059669; }
        .react-calendar-heatmap .color-scale-3 { fill: #10b981; }
        .react-calendar-heatmap .color-scale-4 { 
            fill: #34d399;
            filter: drop-shadow(0 0 2px rgba(52, 211, 153, 0.2));
        }
      `}</style>
    </div>
  );
}

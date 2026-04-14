import { xp_to_level_up, current_level } from "../Helpers/Xp";
import { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  Dumbbell,
  Footprints,
  Target,
  Crown,
  TrendingUp,
  Shield,
  Ghost,
  Sword,
  Compass,
  Medal,
  Users,
  Brain,
  CheckCircle,
} from "lucide-react";

export default function Trophy({ userData }) {
  const titles = {};
  for (let i = 1; i <= 15; i++) {
    titles[i] = `/Titles/${i}.png`;
  }

  const icons = [
    {
      component: Flame,
      label: "Inferno",
      criteria: "Maintain a 30-day consecutive activity streak.",
    },
    {
      component: Zap,
      label: "Voltage",
      criteria: "Log 300 total workouts.",
    },
    {
      component: Dumbbell,
      label: "Iron",
      criteria: "Surpass 100,000 lbs in cumulative volume lifted.",
    },
    {
      component: Footprints,
      label: "March",
      criteria: "Complete 26.2 miles in cumulative run distance.",
    },
    {
      component: Target,
      label: "Deadeye",
      criteria: "Achieve a score of 90 or higher on the Space Force PT test.",
    },
    {
      component: Crown,
      label: "Elite",
      criteria: "Achieve a perfect 100 score on the Space Force PT test.",
    },
    {
      component: TrendingUp,
      label: "Apex",
      criteria: "Log 50 sessions with a heart rate in the 'Peak' zone.",
    },
    {
      component: Shield,
      label: "Bastion",
      criteria: "Log 100 total hours of strength-specific training.",
    },
    {
      component: Ghost,
      label: "Phantom",
      criteria: "Complete 10 sessions between 0300 and 0500 hours.",
    },
    {
      component: Sword,
      label: "Combat",
      criteria: "Register 1000 workouts.",
    },
    {
      component: Compass,
      label: "Scout",
      criteria: "Track 50 miles of outdoor running.",
    },
    {
      component: Medal,
      label: "Veteran",
      criteria: "Complete 365 days of active days in the app.",
    },
    {
      component: Users,
      label: "Platoon",
      criteria: "Participate in 25 group workouts.",
    },
    {
      component: Brain,
      label: "Zenith",
      criteria: "Complete 50 workouts in one week.",
    },
    {
      component: CheckCircle,
      label: "Mission",
      criteria: "Complete an activity for 14 consecutive days.",
    },
  ];

  if (!userData) return <h1>Loading...</h1>;

  const curr_level = current_level(userData.xp);
  const level_up = xp_to_level_up(curr_level + 1);
  return (
    <div id="trophy-case" className="mt-6 pt-4 border-t border-base-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-[10px] uppercase font-black opacity-40 tracking-widest italic">
          Trophy Case
        </h3>
        <span className="badge badge-sm badge-ghost opacity-50 font-mono text-[10px]">
          {userData.badges_ids.length} COLLECTED
        </span>
      </div>

      <div
        id="trophies"
        className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x"
      >
        {userData.badges_ids.map((badge, index) => (
          <div key={index} className="snap-start shrink-0 group cursor-help">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="avatar group [perspective:1000px] w-40 h-40">
                <div className="relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ">
                  <div className="avatar">
                    <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-base-200 to-base-300 shadow-lg border border-base-100 p-4 flex flex-col items-center justify-between text-center group hover:border-primary/50 transition-all duration-300">
                      {(() => {
                        const badgeData = icons[badge - 1];
                        if (!badgeData) return null;
                        const IconTag = badgeData.component;

                        return (
                          <>
                            <IconTag
                              size={36}
                              strokeWidth={1.25}
                              className="text-primary mt-1 drop-shadow-[0_0_8px_rgba(var(--p),0.3)]"
                            />

                            <div className="flex-1 flex items-center justify-center px-1">
                              <p className="text-[11px] leading-tight text-base-content/80 font-medium italic">
                                "{badgeData.criteria}"
                              </p>
                            </div>

                            <span className="text-[9px] uppercase tracking-[0.2em] text-primary font-bold pt-2 border-t border-base-content/5 w-full">
                              {badgeData.label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div id=" xp bar" className="mt-6 space-y-1">
        <div className="flex justify-between text-[10px] font-black uppercase opacity-40 tracking-widest">
          <span>Level {curr_level}</span>
          <span>
            {userData.xp}/{level_up} XP
          </span>
        </div>
        <div className="h-2 w-full bg-base-content/10 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(userData.xp / level_up) * 100}%` }}
          ></div>
        </div>
      </div>

      <div id="Titles" className="flex-1 mt-6">
        <h3 className="text-[10px] uppercase font-black opacity-40 tracking-widest italic">
          Earned Titles
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x snap-mandatory">
          {userData.titles_ids.map((id, index) => (
            <div
              key={index}
              className="flex-none w-64 snap-center relative group overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-[1px] transition-all duration-300 hover:scale-105"
            >
              <div className="bg-[#121212] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={titles[id]}
                  alt={`Title ${id}`}
                  className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

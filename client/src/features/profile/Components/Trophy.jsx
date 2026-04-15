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
  const titles = [
    {
      path: "/Titles/emp.png",
      label: "The Blackout",
      criteria: "Log 10 workouts between 0400 and 0500",
    },
    {
      path: "/Titles/fastrun.png",
      label: "Overdrive",
      criteria: "Run 200 total miles since account creation",
    },
    {
      path: "/Titles/ghost.png",
      label: "Off the Grid",
      criteria: "Complete ten individual workouts between 1200 and 0400",
    },
    {
      path: "/Titles/king.png",
      label: "King of the Hill",
      criteria:
        "Hold the number one leaderboard spot in your unit for one full week",
    },
    {
      path: "/Titles/master.png",
      label: "Vanguard",
      criteria: "Log 100 total hours of recorded physical training",
    },
    {
      path: "/Titles/ninja.png",
      label: "Nightshade",
      criteria: "Complete 25 training sessions before sunrise or after sunset",
    },
    {
      path: "/Titles/nuke.png",
      label: "Supernova",
      criteria:
        "Achieve a perfect 100 point score on a Space Force Physical Fitness Assessment",
    },
    {
      path: "/Titles/number1.png",
      label: "Main Character",
      criteria:
        "Finish in the top spot of a unit-wide daily leaderboard 25 times",
    },
    {
      path: "/Titles/relentless.png",
      label: "Relentless",
      criteria:
        "Complete 20 consecutive days of physical training without a missed session",
    },
    {
      path: "/Titles/run.png",
      label: "Cloudwalker",
      criteria: "Maintain a sub 8 minute mile pace for 50 total miles",
    },
    {
      path: "/Titles/runn.png",
      label: "Double Time",
      criteria:
        "Log two separate 2 mile runs within the same 24 hour period 10 times",
    },
    {
      path: "/Titles/strong.png",
      label: "Brute Force",
      criteria:
        "Complete 500 total repetitions of weighted squats or deadlifts in a single month",
    },
    {
      path: "/Titles/stronger.png",
      label: "Indestructible",
      criteria: "Complete 100 sets of core-stabilizing exercises",
    },
    {
      path: "/Titles/swim.png",
      label: "Deep Water",
      criteria: "Accumulate 10,000 total meters of swimming in a single month",
    },
    {
      path: "/Titles/vsat.png",
      label: "High Ground",
      criteria:
        "Complete 100 total flights of stairs or 1,000 feet of elevation gain in a single week",
    },
  ];

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

      <div id="Titles" className="flex-1 mt-6 w-full">
        <h3 className="text-[10px] uppercase font-black opacity-40 tracking-widest italic mb-3">
          Earned Titles
        </h3>

        <div className="flex overflow-x-auto gap-4 pb-8 no-scrollbar snap-x snap-mandatory [perspective:1000px]">
          {userData.titles_ids.map((id, index) => {
            const card = titles[id - 1];
            if (!card) return null;

            return (
              <div
                key={index}
                className="flex-none w-80 h-32 snap-center relative group cursor-pointer"
              >
                <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]">
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 [backface-visibility:hidden] z-[2] flex flex-col border border-white/10 overflow-hidden bg-[#0a0a0a]">
                    {/* 1. The Image (Top part) */}
                    <div className="flex-grow overflow-hidden">
                      <img
                        src={card.path}
                        alt={card.label}
                        className="w-full h-full object-cover opacity-90"
                      />
                    </div>

                    {/* 2. The Solid Black Bar (Bottom part) */}
                    <div className="h-8 bg-black flex items-center px-3 border-t border-white/20">
                      <h3 className="text-white font-sans font-bold text-[11px] uppercase tracking-wider">
                        {card.label}
                      </h3>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)] z-[1] bg-[#111] border border-white/10 flex flex-col justify-center items-center px-4">
                    <span className="text-[10px] uppercase tracking-widest text-accent mb-1 font-bold">
                      Challenge Criteria
                    </span>
                    <p className="text-white text-[12px] leading-tight text-center italic opacity-80">
                      "{card.criteria}"
                    </p>

                    {/* Decorative Corner (Optional BO2 vibe) */}
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-accent/50" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

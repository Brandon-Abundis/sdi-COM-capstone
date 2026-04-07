import { xp_to_level_up, current_level } from "../Helpers/Xp";

export default function Trophy({ userData }) {
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
          {userData.badges.length} COLLECTED
        </span>
      </div>

      <div
        id="trophies"
        className="flex gap-6 overflow-x-auto pb-4 px-2 scrollbar-hide snap-x"
      >
        {userData.badges.map((badge, index) => (
          <div key={index} className="snap-start shrink-0 group cursor-help">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="avatar">
                <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-base-200 to-base-300 shadow-lg border border-base-100 group-hover:border-primary/50 transition-all duration-300 group-hover:-translate-y-2">
                  <img
                    src={badge}
                    alt="Trophy"
                    className="object-contain p-1"
                  />
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
        <progress
          className="progress progress-primary w-full h-2 shadow-inner"
          value={userData.xp}
          max={level_up}
        ></progress>
      </div>

      <div id="Titles" className="flex-1">
        <h3 className="text-[10px] uppercase font-black opacity-40 mb-2 tracking-widest">
          Earned Titles
        </h3>
        <div className="flex flex-wrap gap-1">
          {userData.titles.map((title, index) => (
            <span
              key={index}
              className="badge badge-ghost badge-lg font-medium whitespace-nowrap"
            >
              {title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

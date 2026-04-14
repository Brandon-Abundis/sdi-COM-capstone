import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../app/AuthProvider";

//_________________________________brandon's code_______________________________________
import useFetchBestRuns from "./costomHooks/getFetchBestRuns";
import useFetchBestPushUps from "./costomHooks/getFetchBestPushUps";
import useFetchBestSitUps from "./costomHooks/getFetchBestSitUps";
//______________________________________________________________________________________

export default function Leaderboard() {
  //const user = [ (user:pt score, push ups, situps, minutes, 2 mile)]
  // use .sort to organize by score asc -> desc
  //Fetch for user scores will go here
  const [UserData, setUserData] = useState();
  const [users, setUsers] = useState();
  const [scores, setScores] = useState();
  const [merged, setMerged] = useState();

  const [gender, setGender] = useState("all");
  const [ageGroup, setAgeGroup] = useState("all");

  const { user, logout } = useAuth();

  /*________________________________brandon's code______________________________________*/
  const { runs } = useFetchBestRuns();
  const { sitUps } = useFetchBestSitUps();
  const { pushUps } = useFetchBestPushUps();

  if (!runs && !sitUps && !pushUps) {
    return <h1>Loading Leaderboard data...</h1>;
  }
  /*_____________________________________________________________________________________*/

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // padStart ensures that 14:4 becomes 14:04
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  // const filteredGenderedRuns = gender === 'all' ? runs : runs?.filter(entry => entry.gender === gender);
  // const filteredGenderedSitups = gender === 'all' ? sitUps : sitUps?.filter(entry => entry.gender === gender);
  // const filteredGenderedPushups = gender === 'all' ? pushUps : pushUps?.filter(entry = entry.gender === gender);

  // const filteredRuns = ageGroup === 'all' ? ;
  const applyFilters = (data) => {
    //check if undefined
    if (!data) return [];

    //runs through gender first
    const genderFilter =
      gender === "all" ? data : data.filter((entry) => entry.gender === gender);

    //runs though age second
    if (ageGroup === "all") return genderFilter;
    if (ageGroup === "< 25") return genderFilter.filter((e) => e.age < 25);
    if (ageGroup === "25-29")
      return genderFilter.filter((e) => e.age >= 25 && e.age <= 29);
    if (ageGroup === "30-34")
      return genderFilter.filter((e) => e.age >= 30 && e.age <= 34);
    if (ageGroup === "35-39")
      return genderFilter.filter((e) => e.age >= 35 && e.age <= 39);
    if (ageGroup === "40-44")
      return genderFilter.filter((e) => e.age >= 40 && e.age <= 44);
    if (ageGroup === "45-49")
      return genderFilter.filter((e) => e.age >= 45 && e.age <= 49);

    //just incase something really bad happens...
    return genderFilter;
  };

  useEffect(() => {
    fetch(`http://localhost:8080/users/id/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      });
  }, [user]);
  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [scoresRes, usersRes] = await Promise.all([
          fetch("http://localhost:8080/scores"),
          fetch("http://localhost:8080/users"),
        ]);

        const scoresData = await scoresRes.json();
        const usersData = await usersRes.json();

        setScores(scoresData);
        setUsers(usersData);

        const mergedData = usersData.map((user) => ({
          ...user,
          ...scoresData.find((score) => score.id === user.id),
        }));

        setMerged(mergedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  // console.log(merged);

  // function onBoard() {
  //   const Alert = () => {
  //     alert("Congratulations! You made it on the Leaderboard!");
  //   };
  // }

  if (!users && !scores) return <h1>Loading Leaderboards...</h1>;
  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold text-primary tracking-wide">
          LEADERBOARDS
        </h1>

        <div className="flex flex-wrap gap-4 bg-base-300 p-4 rounded-xl border border-accent">
          {/* Gender Dropdown */}
          <div className="flex flex-col flex-1 min-w-37.5">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-base-100 text-white px-3 py-1 rounded-lg border border-gray-600 focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Age Dropdown */}
          <div className="flex flex-col flex-1 min-w-37.5">
            <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Age Bracket
            </label>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              className="bg-base-100 text-white px-3 py-1 rounded-lg border border-gray-600 focus:border-blue-500 outline-none appearance-none"
            >
              <option value="all">Overall (All Ages)</option>
              <option value="< 25">&lt; 25</option>
              <option value="25-29">25 - 29</option>
              <option value="30-34">30 - 34</option>
              <option value="35-39">35 - 39</option>
              <option value="40-44">40 - 44</option>
              <option value="45-49">45 - 49</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full bg-base-200 rounded-xl shadow-2xl p-4 mb-6 text-white">
          <h1 className="text-xl text-secondary font-bold text-center mb-1 pb-2 uppercase tracking-tight">
            Top 10 PT Scores
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {applyFilters(merged)
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((merge, index) => {
                const rank = index + 1;
                const trophy =
                  rank === 1
                    ? "🏆"
                    : rank === 2
                      ? "🥈"
                      : rank === 3
                        ? "🥉"
                        : "";

                return (
                  <div
                    key={merge.id}
                    // Dynamic border logic: Yellow for top 3, Blue for the rest
                    className={`flex items-center justify-between bg-base-300 p-3 rounded-lg border-1 ${
                      rank <= 3
                        ? "border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                        : "border-blue-400"
                    }`}
                  >
                    {/* Left section: Rank and Name info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-lg font-bold w-5 flex-shrink-0 ${rank <= 3 ? "text-yellow-400" : "text-gray-400"}`}
                      >
                        {rank}.
                      </span>
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm text-base-content/60">
                          {merge.rank}
                        </span>
                        <span className="font-semibold text-sm whitespace-nowrap">
                          {merge.first_name} {merge.last_name}
                        </span>
                      </div>
                    </div>

                    {/* Right section: Score and Trophy */}
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span>{trophy}</span>
                      <span className="text-yellow-400 font-mono font-bold">
                        {((merge.score / 20) * 1.27).toFixed(0)}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        {/* ---------------------------------------------------------------------------------- */}
        <div className="flex flex-wrap justify-center gap-6">
          {/* 2 mile component */}
          <div className="w-96 bg-base-200 rounded-xl shadow-2xl p-4 text-white">
            <h1 className="text-xl text-secondary font-bold text-center mb-1 pb-2 uppercase tracking-tight">
              Fastest 2-Mile Runs
            </h1>

            <div className="space-y-3">
              {applyFilters(runs)
                .slice(0, 10)
                .map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  const trophy =
                    rank === 1
                      ? "🏆"
                      : rank === 2
                        ? "🥈"
                        : rank === 3
                          ? "🥉"
                          : "";

                  return (
                    <div
                      key={entry.workout_id}
                      // Unified subtle glow and border-2 for consistency
                      className={`flex items-center justify-between bg-base-300 p-3 rounded-lg transition-all duration-300 ${
                        isTopThree
                          ? "border-1 border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.15)]"
                          : "border-1 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Gold rank for winners, gray for others */}
                        <span
                          className={`text-lg font-bold w-5 ${isTopThree ? "text-yellow-400" : "text-gray-500"}`}
                        >
                          {rank}.
                        </span>

                        {/* Circular Avatar Placeholder (Preserved) */}
                        {/* <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600">
                          <img
                            src={entry.profile || 'https://placeholder.com'}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        </div> */}

                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-base-content/60 leading-none">
                            {entry.rank}
                          </span>
                          <span className="font-semibold text-sm">
                            {entry.first_name} {entry.last_name}
                          </span>
                        </div>
                      </div>

                      {/* Time & Trophy */}
                      <div className="flex items-center gap-2">
                        <span>{trophy}</span>
                        <span className="text-yellow-400 font-mono font-bold">
                          {formatTime(entry.time)}{" "}
                          <span className="text-[10px] text-gray-400 uppercase">
                            min
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* ---------------------------------------------------------------------------------- */}
          <div className="w-96 bg-base-200 rounded-xl shadow-2xl p-4 text-white">
            <h1 className="text-xl text-secondary font-bold text-center mb-1 pb-2 uppercase tracking-tight">
              Most Push Ups
            </h1>
            <div className="space-y-3">
              {applyFilters(pushUps)
                .slice(0, 10)
                .map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  const trophy =
                    rank === 1
                      ? "🏆"
                      : rank === 2
                        ? "🥈"
                        : rank === 3
                          ? "🥉"
                          : "";

                  return (
                    <div
                      key={entry.workout_id}
                      // Conditionally add yellow border and glow for top 3 only
                      className={`flex items-center justify-between bg-base-300 p-3 rounded-lg ${
                        isTopThree
                          ? "border-1 border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.15)]"
                          : "border-1 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank number stays gold for top 3, gray for others */}
                        <span
                          className={`text-lg font-bold w-5 ${isTopThree ? "text-yellow-400" : "text-gray-500"}`}
                        >
                          {rank}.
                        </span>
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-base-content/60 leading-none">
                            {entry.rank}
                          </span>
                          <span className="font-semibold text-sm">
                            {entry.first_name} {entry.last_name}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{trophy}</span>
                        <span className="text-yellow-400 font-mono font-bold">
                          {entry.reps}{" "}
                          <span className="text-[10px] text-gray-400 uppercase">
                            Reps
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          {/* --------------------------------------------------------------------------------------- */}
          <div className="w-96 bg-base-200 rounded-xl shadow-2xl p-4 text-white">
            <h1 className="text-xl text-secondary font-bold text-center mb-1 pb-2 uppercase tracking-tight">
              Most Sit Ups
            </h1>
            <div className="space-y-3">
              {applyFilters(sitUps)
                .slice(0, 10)
                .map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  const trophy =
                    rank === 1
                      ? "🏆"
                      : rank === 2
                        ? "🥈"
                        : rank === 3
                          ? "🥉"
                          : "";

                  return (
                    <div
                      key={entry.workout_id}
                      // Matches the subtle glow and border-2 consistency from the Push Ups card
                      className={`flex items-center justify-between bg-base-300 p-3 rounded-lg transition-all duration-300 ${
                        isTopThree
                          ? "border-1 border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.15)]"
                          : "border-1 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Rank color matches Push Ups: Gold for Top 3, Gray for 4-10 */}
                        <span
                          className={`text-lg font-bold w-5 ${isTopThree ? "text-yellow-400" : "text-gray-500"}`}
                        >
                          {rank}.
                        </span>

                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-base-content/60 leading-none">
                            {entry.rank}
                          </span>
                          <span className="font-semibold text-sm">
                            {entry.first_name} {entry.last_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>{trophy}</span>
                        <span className="text-yellow-400 font-mono font-bold">
                          {entry.reps}{" "}
                          <span className="text-[10px] text-gray-400 uppercase">
                            Reps
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* --------------------------------------------------------------------------------- */}
          <div className="w-96 bg-base-200 rounded-xl shadow-2xl p-4 text-white">
            <h1 className="text-xl text-secondary font-bold text-center mb-1 pb-2 uppercase tracking-tight">
              Most PT Minutes
            </h1>
            <div className="space-y-3">
              {applyFilters(merged)
                .sort((a, b) => b.score / 7 - a.score / 7)
                .slice(0, 10)
                .map((entry, index) => {
                  const rank = index + 1;
                  const isTopThree = rank <= 3;
                  const trophy =
                    rank === 1
                      ? "🏆"
                      : rank === 2
                        ? "🥈"
                        : rank === 3
                          ? "🥉"
                          : "";

                  return (
                    <div
                      key={entry.id}
                      // Applying the unified subtle glow and border-2 for layout stability
                      className={`flex items-center justify-between bg-base-300 p-3 rounded-lg transition-all duration-300 ${
                        isTopThree
                          ? "border-1 border-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.15)]"
                          : "border-1 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Gold rank for winners, gray for the rest */}
                        <span
                          className={`text-lg font-bold w-5 ${isTopThree ? "text-yellow-400" : "text-gray-500"}`}
                        >
                          {rank}.
                        </span>

                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase text-base-content/60 leading-none">
                            {entry.rank}
                          </span>
                          <span className="font-semibold text-sm">
                            {entry.first_name} {entry.last_name}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>{trophy}</span>
                        <span className="text-yellow-400 font-mono font-bold">
                          {(entry.score / 7).toFixed(2)}{" "}
                          <span className="text-[10px] text-gray-400 uppercase">
                            min
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

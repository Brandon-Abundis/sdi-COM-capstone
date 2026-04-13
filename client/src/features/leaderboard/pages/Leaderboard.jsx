import "./Leaderboard.css";
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

  const [gender, setGender] = useState('all');
  const [ageGroup, setAgeGroup] = useState('all');

  const { user, logout } = useAuth();

  /*________________________________brandon's code______________________________________*/
  const { runs } = useFetchBestRuns();
  const { sitUps } = useFetchBestSitUps();
  const { pushUps } = useFetchBestPushUps();

  if( !runs && !sitUps && !pushUps) { return <h1>Loading Leaderboard data...</h1> }
  /*_____________________________________________________________________________________*/

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // padStart ensures that 14:4 becomes 14:04
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};
  // const filteredGenderedRuns = gender === 'all' ? runs : runs?.filter(entry => entry.gender === gender);
  // const filteredGenderedSitups = gender === 'all' ? sitUps : sitUps?.filter(entry => entry.gender === gender);
  // const filteredGenderedPushups = gender === 'all' ? pushUps : pushUps?.filter(entry = entry.gender === gender);

  // const filteredRuns = ageGroup === 'all' ? ;
  const applyFilters = (data) => {
    //check if undefined
    if (!data) return [];

    //runs through gender first
    const genderFilter = gender === 'all' ? data : data.filter(entry => entry.gender === gender);

    //runs though age second
    if(ageGroup === 'all') return genderFilter;
    if(ageGroup === '< 25') return genderFilter.filter(e => e.age < 25);
    if(ageGroup === '25-29') return genderFilter.filter(e => e.age >= 25 && e.age <= 29);
    if(ageGroup === '30-34') return genderFilter.filter(e => e.age >= 30 && e.age <= 34);
    if(ageGroup === '35-39') return genderFilter.filter(e => e.age >= 35 && e.age <= 39);
    if(ageGroup === '40-44') return genderFilter.filter(e => e.age >= 40 && e.age <= 44);
    if(ageGroup === '45-49') return genderFilter.filter(e => e.age >= 45 && e.age <= 49);

    //just incase something really bad happens...
    return genderFilter;
  }

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
    <>
      <h1 className="text-3xl font-bold underline text-primary mb-6 tracking-wide">
        PT LEADERBOARDS
      </h1>

      <div className="flex flex-wrap gap-4 mb-8 bg-gray-800 p-4 rounded-xl border border-gray-700">
  {/* Gender Dropdown */}
  <div className="flex flex-col flex-1 min-w-[150px]">
      <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
        Gender
      </label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        className="bg-gray-900 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none appearance-none"
      >
        <option value="all">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    {/* Age Dropdown */}
    <div className="flex flex-col flex-1 min-w-[150px]">
      <label className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
        Age Bracket
      </label>
      <select
        value={ageGroup}
        onChange={(e) => setAgeGroup(e.target.value)}
        className="bg-gray-900 text-white p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none appearance-none"
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

      <div id="LBs">
        <div id="PT_Scores">
          <h1 className="text-lg font-bold text-accent">Top 10 PT Scores</h1>
          <ol>
            {merged
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((merge) => (
                <li key={merge.id}>
                  {merge.rank} {merge.last_name}:{" "}
                  {((merge.score / 20) * 1.27).toFixed(0)}
                  {UserData.id === merge.id &&
                    alert("Congratulations! You made it on the Leaderboard!")}
                </li>
              ))}
          </ol>
        </div>
        <div id="Small_LBs">
          <div id="Two_Mile">
            <h1 className="text-lg font-bold text-accent">
              Top 10 Fastest 2-Mile Runs
            </h1>
            <ol>
              {applyFilters(runs).map(entry => (
                <li key={entry.id}>
                  {entry.rank} {entry.first_name} {entry.last_name} : {formatTime(entry.time)}
                </li>
              )).slice(0, 10) }
            </ol>
          </div>
          <div id="Push-Ups">
            <h1 className="text-lg font-bold text-accent">
              Top 10 Most Push Ups (M/F)
            </h1>
            <ol>
              {merged
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 22).toFixed(0)} Reps
                    {UserData.id === merge.id &&
                      alert("Congratulations! You made it on the Leaderboard!")}
                  </li>
                ))}
            </ol>
          </div>
          <div id="Sit-Ups">
            <h1 className="text-lg font-bold text-accent">
              Top 10 Most Sit Ups (M/F)
            </h1>
            <ol>
              {merged
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 22).toFixed(0)} Reps
                    {UserData.id === merge.id &&
                      alert("Congratulations! You made it on the Leaderboard!")}
                  </li>
                ))}
            </ol>
          </div>
          <div id="Minutes">
            <h1 className="text-lg font-bold text-accent">
              Top 10 Most PT Minutes
            </h1>
            <ol>
              {merged
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 7).toFixed(2)} Minutes
                    {UserData.id === merge.id &&
                      alert("Congratulations! You made it on the Leaderboard!")}
                  </li>
                ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}

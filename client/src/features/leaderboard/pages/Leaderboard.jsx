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

  // useEffect(() => {
  //   fetch(`http://localhost:8080/scores`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setScores(data);
  //       console.log(data);
  //     });
  //   fetch(`http://localhost:8080/users`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setUsers(data);
  //       console.log(data);
  //     });
  // }, []);
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
    <div className="min-h-screen bg-base-100 p-6">
      <h1 className="text-3xl font-bold text-primary mb-6 tracking-wide">
        PT LEADERBOARDS
      </h1>
      <div className="flex flex-col items-center gap-6">
        <div className="w-72 bg-base-200 rounded-lg shadow-md p-6">
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
        <div className="flex flex-wrap justify-center gap-6">
          <div className="w-72 bg-base-200 rounded-lg shadow-md p-6">
            <h1 className="text-lg font-bold text-accent">
              Top 10 Fastest 2-Mile Runs
            </h1>
            <ol>
              {runs
                .map((entry) => (
                  <li key={entry.id}>
                    {entry.rank} {entry.first_name} {entry.last_name} :{" "}
                    {formatTime(entry.time)}
                  </li>
                ))
                .slice(0, 10)}
            </ol>
          </div>
          <div className="w-72 bg-base-200 rounded-lg shadow-md p-6">
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
          <div className="w-72 bg-base-200 rounded-lg shadow-md p-6">
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
          <div className="w-72 bg-base-200 rounded-lg shadow-md p-6">
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
    </div>
  );
}

import "./Leaderboard.css";
import { useState, useEffect, useMemo } from "react";

export default function Leaderboard() {
  //const user = [ (user:pt score, push ups, situps, minutes, 2 mile)]
  // use .sort to organize by score asc -> desc
  //Fetch for user scores will go here
  const [users, setUsers] = useState();
  const [scores, setScores] = useState();
  const [merged, setMerged] = useState();

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
  console.log(merged);

  if (!users && !scores) return <h1>Loading Leaderboards...</h1>;
  return (
    <>
      <h1 className="text-3xl font-bold text-[#7c3aed] mb-6 tracking-wide">
        PT LEADERBOARDS
      </h1>
      <div id="LBs">
        <div id="PT_Scores">
          <h1 className="text-lg font-bold text-[#c084fc]">Top 10 PT Scores</h1>
          <ol>
            {merged
              .sort((a, b) => b.score - a.score)
              .slice(0, 10)
              .map((merge) => (
                <li key={merge.id}>
                  {merge.rank} {merge.last_name}:{" "}
                  {((merge.score / 20) * 1.27).toFixed(0)}
                </li>
              ))}
          </ol>
        </div>
        <div id="Small_LBs">
          <div id="Two_Mile">
            <h1 className="text-lg font-bold text-[#c084fc]">
              Top 10 Fastest 2-Mile Runs
            </h1>
            <ol>
              {merged
                .sort((a, b) => a.score - b.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 17.5).toFixed(2)} Minutes
                  </li>
                ))}
            </ol>
          </div>
          <div id="Push-Ups">
            <h1 className="text-lg font-bold text-[#c084fc]">
              Top 10 Most Push Ups (M/F)
            </h1>
            <ol>
              {merged
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 25).toFixed(0)} Reps
                  </li>
                ))}
            </ol>
          </div>
          <div id="Sit-Ups">
            <h1 className="text-lg font-bold text-[#c084fc]">
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
                  </li>
                ))}
            </ol>
          </div>
          <div id="Minutes">
            <h1 className="text-lg font-bold text-[#c084fc]">
              Top 10 Most PT Minutes
            </h1>
            <ol>
              {merged
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map((merge) => (
                  <li key={merge.id}>
                    {merge.rank} {merge.last_name}:{" "}
                    {(merge.score / 10).toFixed(2)} Minutes
                  </li>
                ))}
            </ol>
          </div>
        </div>
        <h2>Pop up for making it on the leaderboard goes here!</h2>
      </div>
    </>
  );
}

import "./Leaderboard.css";
// import { useState, useEffect } from "react";

export default function Leaderboard() {
  //const user = [ (user:pt score, push ups, situps, minutes, 2 mile)]
  // use .sort to organize by score asc -> desc
  //Fetch for user scores will go here

  return (
    <>
      <h1>
        <i>PT LEADERBOARDS</i>
      </h1>
      <div id="LBs">
        <div id="PT_Scores">
          <h1>Top 10 PT Scores</h1>
          <ol>
            <li>1. Cmdr Jimmy "James" DeCarlo: 100%</li>
            <li>1. Cmdr Jimmy "James" DeCarlo: 100%</li>
            <li>1. Cmdr Jimmy "James" DeCarlo: 100%</li>
            <li>1. Cmdr Jimmy "James" DeCarlo: 100%</li>
            <li>1. Cmdr Jimmy "James" DeCarlo: 100%</li>
          </ol>
        </div>
        <div id="Small_LBs">
          <div id="Two_Mile">
            <h1>Top 10 Fastest 2-Mile Runs</h1>
            <ol>
              <li>1. Cmdr Jimmy "James" DeCarlo: 4:00</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 4:00</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 4:00</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 4:00</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 4:00</li>
            </ol>
          </div>
          <div id="Push-Ups">
            <h1>Top 10 Most Push Ups (M/F)</h1>
            <ol>
              <li>1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
            </ol>
          </div>
          <div id="Sit-Ups">
            <h1>Top 10 Most Sit Ups (M/F)</h1>
            <ol>
              <li> 1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li> 1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li> 1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li> 1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
              <li> 1. Cmdr Jimmy "James" DeCarlo: 1,000 Reps</li>
            </ol>
          </div>
          <div id="Minutes">
            <h1> Top 10 Most PT Minutes</h1>
            <ol>
              <li>1. Cmdr Jimmy "James" DeCarlo: 12,000,000 Mins</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 12,000,000 Mins</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 12,000,000 Mins</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 12,000,000 Mins</li>
              <li>1. Cmdr Jimmy "James" DeCarlo: 12,000,000 Mins</li>
            </ol>
          </div>
        </div>
        <h2>Pop up for making it on the leaderboard goes here!</h2>
      </div>
    </>
  );
}

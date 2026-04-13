import { useState, useEffect } from "react";

export default function useFetchBestRuns() {
  const [runs, setRuns] = useState([]);

  useEffect(() => {
    async function fetchRunData() {
      const allRunData = await fetch('http://localhost:8080/leaderboard/runs')
        .then(res => res.json());

      setRuns(allRunData);
    }
    fetchRunData();
  }, []);
  return { runs, setRuns }
}
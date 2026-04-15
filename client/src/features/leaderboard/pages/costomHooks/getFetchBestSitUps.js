import { useState, useEffect } from "react";

export default function useFetchBestSitUps() {
  const [sitUps, setSitUps] = useState([]);

  useEffect(() => {
    async function fetchAllSitUps(){
      const allPushUpsData = await fetch('http://localhost:8080/leaderboard/situps')
        .then(res => res.json());

        setSitUps(allPushUpsData);
    }
    fetchAllSitUps();
  }, []);
  return { sitUps, setSitUps }
}
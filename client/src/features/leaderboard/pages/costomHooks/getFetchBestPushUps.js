import { useState, useEffect } from "react";

export default function useFetchBestPushUps() {
  const [pushUps, setPushUps] = useState([]);

  useEffect(() => {
    async function fetchAllPushUps(){
      const allPushUpsData = await fetch('http://localhost:8080/leaderboard/pushups')
        .then(res => res.json());

        setPushUps(allPushUpsData);
    }
    fetchAllPushUps();
  }, []);
  return { pushUps, setPushUps }
}
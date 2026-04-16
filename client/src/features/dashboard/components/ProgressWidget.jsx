import { useState, useEffect } from "react";
import { useAuth } from "../../../app/AuthProvider";
import { fetchAllUsers } from "../api/userProgress";

export default function ProgressWidget() {
  const { user } = useAuth();
  const [userRank, setUserRank] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) return;
      try {
        const allUsers = await fetchAllUsers();

        // Filter only active users
        const activeUsers = allUsers.filter((u) => u.is_active === true);
        setTotalActiveUsers(activeUsers.length);

        // Sort users by XP to get rankings
        const rankedUsers = activeUsers
          .sort((a, b) => (b.xp || 0) - (a.xp || 0))
          .map((u, index) => ({
            ...u,
            rank: index + 1,
          }));

        // Find current user's rank and XP
        const currentUserData = rankedUsers.find((u) => u.id === user.id);
        if (currentUserData) {
          setUserRank(currentUserData.rank);

          // Get nearby users: 2 above, current user, 2 below
          const currentIndex = rankedUsers.findIndex((u) => u.id === user.id);
          const startIdx = Math.max(0, currentIndex - 2);
          const endIdx = Math.min(rankedUsers.length, currentIndex + 3);
          const nearby = rankedUsers.slice(startIdx, endIdx);
          setNearbyUsers(nearby);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProgress();
  }, [user?.id, user?.xp]);

  if (loading)
    return <div className="card bg-base-200 p-4">Loading progress...</div>;
  if (error)
    return (
      <div className="card bg-base-200 p-4 text-error">Error: {error}</div>
    );

  return (
    <div className="card bg-base-200 p-4">
      <h3 className="text-2xl font-bold text-primary mb-4">💪 Progress</h3>

      {userRank ? (
        <div className="space-y-4">
          <div className="bg-base-300 rounded-lg p-3">
            <p className="text-sm font-bold text-base-content/70 uppercase tracking-wide">
              Your Rank
            </p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-primary">
                #{userRank}
              </span>
              <div className="text-right">
                <p className="text-xl font-bold text-yellow-400">
                  {user.xp || 0} XP
                </p>
              </div>
            </div>
            <p className="text-xs text-base-content/60">
              of {totalActiveUsers} active users
            </p>
          </div>

          <div>
            <p className="text-sm font-bold text-base-content/70 uppercase tracking-wide mb-2">
              Nearby Users
            </p>
            <div className="space-y-2">
              {nearbyUsers.map((u) => (
                <div
                  key={u.id}
                  className={`flex items-center justify-between p-2 rounded ${
                    u.id === user.id
                      ? "bg-primary/25 border border-primary"
                      : "bg-base-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold w-8 text-center ${
                        u.id === user.id
                          ? "text-primary"
                          : "text-base-content/60"
                      }`}
                    >
                      #{u.rank}
                    </span>
                    <span className="text-sm font-semibold text-base-content">
                      {u.username || `User ${u.id}`}
                    </span>
                    {u.id === user.id && (
                      <span className="text-xs bg-primary px-2 py-0.5 rounded text-primary-content">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-secondary">
                    {u.xp || 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-md text-base-content">Failed to load progress.</p>
      )}
    </div>
  );
}

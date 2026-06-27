'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
  displayName: string;
  totalPoints: number;
  predictionCount: number;
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => {
        setEntries(Array.isArray(data) ? data : data.leaderboard ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load leaderboard.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading leaderboard...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  if (entries.length === 0) {
    return (
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Leaderboard</h2>
        <p className="text-gray-600 text-sm">No predictions yet. Be the first to submit!</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Leaderboard</h2>
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-900 font-semibold">
              <th className="p-3">Rank</th>
              <th className="p-3">Name</th>
              <th className="p-3">Points</th>
              <th className="p-3">Predictions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.displayName} className="border-t text-gray-900">
                <td className="p-3 font-bold text-gray-400">#{index + 1}</td>
                <td className="p-3 font-medium">{entry.displayName}</td>
                <td className="p-3 font-bold">{entry.totalPoints} pts</td>
                <td className="p-3">{entry.predictionCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
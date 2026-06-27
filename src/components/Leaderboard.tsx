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

  if (loading) return <p className="text-center mt-8 text-gray-500">Loading leaderboard...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Leaderboard</h2>
      <table className="w-full text-sm border rounded">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-900">
            <th className="p-2">Rank</th>
            <th className="p-2">Name</th>
            <th className="p-2">Points</th>
            <th className="p-2">Predictions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={entry.displayName} className="border-t text-gray-900">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{entry.displayName}</td>
              <td className="p-2">{entry.totalPoints}</td>
              <td className="p-2">{entry.predictionCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
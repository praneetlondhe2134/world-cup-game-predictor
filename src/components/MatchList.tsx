'use client';
import PredictionForm from './PredictionForm';
import { useEffect, useState } from 'react';

interface Team {
    id: string;
    name: string;
    code: string;
  }
  
  interface Match {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    kickoff: string;
    status: string;
  }

export default function MatchList() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/matches')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : data.matches ?? []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load matches.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-8 text-black-500">Loading matches...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-4 mt-8">
      {matches.map(match => (
        <div key={match.id} className="border rounded-lg p-4 bg-white shadow-sm">
          <div className="flex justify-between text-lg font-semibold">
            <span>{match.homeTeam.name} ({match.homeTeam.code})</span>
            <span className="text-gray-400">vs</span>
            <span>{match.awayTeam.name} ({match.awayTeam.code})</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <p>Kickoff: {match.kickoff}</p>
            <p>Status: {match.status}</p>
          </div>
          <PredictionForm
  matchId={match.id}
  homeTeam={match.homeTeam.name}
  awayTeam={match.awayTeam.name}
  homeTeamId={match.homeTeam.id}
  awayTeamId={match.awayTeam.id}
/>
        </div>
      ))}
    </div>
  );
}
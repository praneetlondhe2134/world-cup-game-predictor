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

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading matches...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="flex flex-col gap-6">
      {matches.map(match => (
        <div key={match.id} className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900">
            <span>{match.homeTeam.name} <span className="text-sm font-normal text-gray-500">({match.homeTeam.code})</span></span>
            <span className="text-gray-400 text-sm font-normal">vs</span>
            <span>{match.awayTeam.name} <span className="text-sm font-normal text-gray-500">({match.awayTeam.code})</span></span>
          </div>
          <div className="mt-3 text-sm text-gray-600 flex gap-6">
            <p>Kickoff: <span className="text-gray-900 font-medium">{match.kickoff || 'TBC'}</span></p>
            <p>Status: <span className="text-gray-900 font-medium capitalize">{match.status}</span></p>
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
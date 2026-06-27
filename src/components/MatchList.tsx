'use client';
import PredictionForm from './PredictionForm';
import { useEffect, useState } from 'react';

interface Team {
  id: string;
  name: string;
  code: string;
}

interface AppPrediction {
  predictedResult: 'home' | 'away' | 'draw';
  predictedWinner: string | null;
  confidence: 'low' | 'medium' | 'high';
  explanation: string;
}

interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  kickoff: string;
  status: string;
  appPrediction: AppPrediction;
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
          {match.appPrediction && (
            <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm">
              <p className="font-semibold text-gray-900 mb-1">App Prediction</p>
              <p className="text-gray-700">Winner: <span className="font-medium">{match.appPrediction.predictedWinner ?? 'Draw'}</span></p>
              <p className="text-gray-700">Confidence: <span className="font-medium capitalize">{match.appPrediction.confidence}</span></p>
              <p className="text-gray-600 mt-1 italic">{match.appPrediction.explanation}</p>
            </div>
          )}
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
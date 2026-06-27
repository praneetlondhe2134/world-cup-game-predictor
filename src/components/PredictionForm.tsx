'use client';

import { useState } from 'react';

interface Props {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamId: string;
  awayTeamId: string;
}

export default function PredictionForm({ matchId, homeTeam, awayTeam, homeTeamId, awayTeamId }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [predictedWinnerId, setPredictedWinnerId] = useState('');
  const [predictedHomeScore, setPredictedHomeScore] = useState('');
  const [predictedAwayScore, setPredictedAwayScore] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const winnerId = predictedWinnerId === 'draw' ? null : predictedWinnerId;
    const homeScore = predictedHomeScore !== '' ? Number(predictedHomeScore) : undefined;
    const awayScore = predictedAwayScore !== '' ? Number(predictedAwayScore) : undefined;

    try {
      const res = await fetch('/api/predictions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          displayName,
          predictedWinnerId: winnerId,
          predictedHomeScore: homeScore,
          predictedAwayScore: awayScore,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Prediction submitted!');
      } else {
        setMessage(data.error ?? 'Something went wrong.');
      }
    } catch {
      setMessage('Network error. Please try again.');
    }

    setIsSubmitting(false);
  }

  return (
    <div className="mt-4 border-t pt-4 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your display name"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        className="border rounded p-2 text-sm w-full text-gray-900"
      />
      <select
        value={predictedWinnerId}
        onChange={e => setPredictedWinnerId(e.target.value)}
        className="border rounded p-2 text-sm w-full text-gray-900"
      >
        <option value="">-- Select winner --</option>
        <option value={homeTeamId}>{homeTeam}</option>
        <option value="draw">Draw</option>
        <option value={awayTeamId}>{awayTeam}</option>
      </select>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Home score"
          value={predictedHomeScore}
          onChange={e => setPredictedHomeScore(e.target.value)}
          className="border rounded p-2 text-sm w-full text-gray-900"
        />
        <input
          type="number"
          placeholder="Away score"
          value={predictedAwayScore}
          onChange={e => setPredictedAwayScore(e.target.value)}
          className="border rounded p-2 text-sm w-full text-gray-900"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Prediction'}
      </button>
      {message && <p className="text-sm text-center">{message}</p>}
    </div>
  );
}
'use client';

import { useState } from 'react';

interface Props {
  homeTeam: string;
  awayTeam: string;
  homeTeamId: number;
  awayTeamId: number;
}

export default function PredictionForm({ homeTeam, awayTeam, homeTeamId, awayTeamId }: Props) {
  const [displayName, setDisplayName] = useState('');
  const [predictedWinnerId, setPredictedWinnerId] = useState('');
  const [predictedHomeScore, setPredictedHomeScore] = useState('');
  const [predictedAwayScore, setPredictedAwayScore] = useState('');
  

  return (
    <div className="mt-4 border-t pt-4 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your display name"
        value={displayName}
        onChange={e => setDisplayName(e.target.value)}
        className="border rounded p-2 text-sm w-full"
      />
      <select
        value={predictedWinnerId}
        onChange={e => setPredictedWinnerId(e.target.value)}
        className="border rounded p-2 text-sm w-full"
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
          className="border rounded p-2 text-sm w-full"
        />
        <input
          type="number"
          placeholder="Away score"
          value={predictedAwayScore}
          onChange={e => setPredictedAwayScore(e.target.value)}
          className="border rounded p-2 text-sm w-full"
        />
      </div>
      <button className="bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700">
        Submit Prediction
      </button>
    </div>
  );
}
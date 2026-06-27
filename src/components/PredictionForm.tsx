'use client';

interface Props {
  homeTeam: string;
  awayTeam: string;
}

export default function PredictionForm({ homeTeam, awayTeam }: Props) {
  return (
    <div className="mt-4 border-t pt-4 flex flex-col gap-3">
      <input
        type="text"
        placeholder="Your display name"
        className="border rounded p-2 text-sm w-full"
      />
      <select className="border rounded p-2 text-sm w-full">
        <option value="home">{homeTeam}</option>
        <option value="draw">Draw</option>
        <option value="away">{awayTeam}</option>
      </select>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Home score"
          className="border rounded p-2 text-sm w-full"
        />
        <input
          type="number"
          placeholder="Away score"
          className="border rounded p-2 text-sm w-full"
        />
      </div>
      <button className="bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700">
        Submit Prediction
      </button>
    </div>
  );
}
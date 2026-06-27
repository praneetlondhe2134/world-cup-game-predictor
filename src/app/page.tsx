import MatchList from '@/components/MatchList';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Sports Match Prediction Platform</h1>
      <p className="text-lg text-gray-600 mb-1">World Cup Edition</p>
      <p className="text-black-500 mb-8">Predict match outcomes and compete with friends on the leaderboard.</p>
      <h2 className="text-xl font-semibold mb-4">Upcoming Matches</h2>
      <MatchList />
    </main>
  );
}
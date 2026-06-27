import MatchList from '@/components/MatchList';
import Leaderboard from '@/components/Leaderboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sports Match Prediction Platform</h1>
          <p className="text-lg font-medium text-gray-700">World Cup Edition</p>
          <p className="text-gray-600 mt-1">Predict match outcomes and compete with friends on the leaderboard.</p>
        </div>
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Matches</h2>
          <MatchList />
        </div>
        <div>
          <Leaderboard />
        </div>
      </div>
    </main>
  );
}
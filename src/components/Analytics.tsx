import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Spinner from "./Spinner";
import TopNav from "./TopNav";

export default function Analytics() {
  const analytics = useQuery(api.userProgress.getAnalytics);

  if (!analytics) {
    return <Spinner />;
  }

  const { totalCompletions, completionsPerProfile, recentCompletionsWithDetails, completionsByMode } = analytics;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-12 px-4 pb-32">
        <TopNav />
        
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold text-center mb-8">Analytics Dashboard</h1>

          {/* Total Completions Card */}
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-semibold text-green-800">Total Exercises Completed</h2>
            <p className="text-4xl font-bold text-green-600 mt-2">{totalCompletions}</p>
          </div>

          {/* Completions by Mode */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Completions by Exercise Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(completionsByMode).map(([mode, count]) => (
                <div key={mode} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-600 font-medium">{mode}</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Leaderboard */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Leaderboard</h2>
            <div className="space-y-4">
              {completionsPerProfile
                .sort((a, b) => b.completions - a.completions)
                .map((profile) => (
                  <div key={profile.profileId} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-gray-600">{profile.completions} exercises completed</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentCompletionsWithDetails.map((completion) => (
                <div key={completion._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={completion.profileAvatarUrl}
                      alt={completion.profileName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-medium">{completion.profileName}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{completion.exerciseMode}</span>
                  </div>
                  <p className="text-gray-800">{completion.sentence}</p>
                  <p className="text-gray-600 text-sm mt-1">{completion.translation}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(completion.completedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
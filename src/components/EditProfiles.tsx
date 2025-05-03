import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function EditProfiles() {
  const navigate = useNavigate();
  const profiles = useQuery(api.profiles.list);
  const updateProfile = useMutation(api.profiles.update);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateAvatars = async () => {
    if (!profiles || isUpdating) return;
    setIsUpdating(true);

    try {
      // Find Irene and Lucas's profiles
      const ireneProfile = profiles.find(p => p.name === 'Irene');
      const lucasProfile = profiles.find(p => p.name === 'Lucas');

      if (ireneProfile) {
        await updateProfile({
          id: ireneProfile._id,
          avatarUrl: `/avatars/irene.png`
        });
        toast.success("Updated Irene's avatar");
      } else {
        toast.error("Could not find Irene's profile");
      }

      if (lucasProfile) {
        await updateProfile({
          id: lucasProfile._id,
          avatarUrl: `/avatars/lucas.png`
        });
        toast.success("Updated Lucas's avatar");
      } else {
        toast.error("Could not find Lucas's profile");
      }

      toast.success("Successfully updated all avatars!");
    } catch (error) {
      toast.error("Failed to update avatars");
      console.error("Error updating avatars:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!profiles) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profiles</h1>
            <button
              onClick={() => navigate("/profiles")}
              className="text-gray-600 hover:text-gray-900"
            >
              Back to Profiles
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">
                Special Avatar Updates
              </h2>
              <p className="text-yellow-700 mb-4">
                Click the button below to update specific avatars:
                <br />• Irene's avatar to 👘
                <br />• Lucas's avatar to 🚵‍♂️
              </p>
              <button
                onClick={handleUpdateAvatars}
                disabled={isUpdating}
                className={`bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isUpdating ? "cursor-wait" : ""
                }`}
              >
                {isUpdating ? "Updating..." : "Update Special Avatars"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profiles.map((profile) => (
                <div
                  key={profile._id}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={profile.avatarUrl}
                      alt={`${profile.name}'s avatar`}
                      className="w-16 h-16"
                    />
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-500">
                        Hard Mode: {profile.hardMode ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
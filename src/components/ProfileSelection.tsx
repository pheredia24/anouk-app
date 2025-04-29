import { useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAppStore } from "../lib/store";
import { Id } from "../../convex/_generated/dataModel";
import TopNav from "./TopNav";
import Spinner from "./Spinner";

export default function ProfileSelection() {
  const navigate = useNavigate();
  const profiles = useQuery(api.profiles.list) || [];
  const setSelectedProfileId = useAppStore((state) => state.setSelectedProfileId);

  const handleProfileSelect = (profileId: Id<"profiles">) => {
    setSelectedProfileId(profileId);
    navigate("/exercise");
  };

  if (!profiles.length) {
    return <Spinner />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      <div className="pt-16">
        <TopNav />
      </div>
      <div className="flex-1 flex flex-col pt-8 px-4 pb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-12">Qui joue ?</h1>
        <div className="grid grid-cols-2 gap-6">
          {profiles.map((profile) => (
            <button
              key={profile._id}
              onClick={() => handleProfileSelect(profile._id)}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50"
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-32 h-32 rounded-full mb-3"
              />
              <span className="font-medium text-lg">{profile.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

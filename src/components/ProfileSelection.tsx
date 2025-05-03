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

  // Sort profiles: Anouk first, then rest alphabetically
  const sortedProfiles = [...profiles].sort((a, b) => {
    // If one of the profiles is Anouk's, it should come first
    if (a.name.toLowerCase() === 'anouk') return -1;
    if (b.name.toLowerCase() === 'anouk') return 1;
    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
  });

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="pt-16">
        <TopNav />
      </div>
      <div className="flex-1 flex flex-col pt-8 px-4 pb-12 max-w-6xl mx-auto overflow-hidden">
        <h1 className="text-2xl font-bold text-center mb-2">¿Quién eres?</h1>
        <p className="text-gray-600 text-base text-center mb-8">Selecciona tu perfil para guardar tu progreso.</p>
        <div className="overflow-y-auto flex-1 px-2">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 pb-4">
            {sortedProfiles.map((profile) => {
              const isAnouk = profile.name.toLowerCase() === 'anouk';
              return (
                <button
                  key={profile._id}
                  onClick={() => handleProfileSelect(profile._id)}
                  className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-20 h-20 md:w-24 md:h-24 mb-2 rounded-full ${
                    isAnouk ? 'p-1 bg-gradient-to-r from-[#58CC02] to-[#89E219]' : ''
                  }`}>
                    <img
                      src={profile.avatarUrl}
                      alt={profile.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <span className="font-medium text-base md:text-lg text-center">
                    {profile.name}{isAnouk ? ' 🎂' : ''}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

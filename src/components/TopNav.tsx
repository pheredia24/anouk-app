import { useNavigate } from "react-router-dom";
import { useAppStore } from "../lib/store";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function TopNav() {
  const navigate = useNavigate();
  const selectedProfileId = useAppStore((state) => state.selectedProfileId);
  const clearSelectedProfile = useAppStore((state) => state.clearSelectedProfile);
  const hasCompletedAll = useQuery(
    api.userProgress.hasCompletedAllExercises,
    selectedProfileId ? { profileId: selectedProfileId } : "skip"
  );

  const handleHomeClick = () => {
    clearSelectedProfile();
    navigate("/");
  };

  return (
    <div className="fixed top-4 left-4 right-4 flex justify-between">
      <button
        onClick={handleHomeClick}
        className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
        aria-label="Retour à l'accueil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </button>

      {hasCompletedAll && (
        <button
          onClick={() => navigate("/finish")}
          className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
          aria-label="Voir toutes les phrases"
        >
          <span className="text-2xl">🏁</span>
        </button>
      )}
    </div>
  );
} 
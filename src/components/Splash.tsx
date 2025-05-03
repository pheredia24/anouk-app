import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <img 
          src="/anoukingo.png" 
          alt="Anoukingo"
          className="w-full h-auto"
        />
        <button
          onClick={() => navigate("/welcome")}
          className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
        >
          Comenzar
        </button>
      </div>
    </div>
  );
}

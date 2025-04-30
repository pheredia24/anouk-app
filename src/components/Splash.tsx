  import { useNavigate } from "react-router-dom";

  export default function Splash() {
    const navigate = useNavigate();

    return (
      <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-white px-5">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <img 
            src="https://vectorlogoseek.com/wp-content/uploads/2019/11/outreach-io-vector-logo.png" 
            alt="Logo"
            className="w-full h-auto"
          />
          <button
            onClick={() => navigate("/welcome")}
            className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
          >
            Commencer
          </button>
        </div>
      </div>
    );
  }

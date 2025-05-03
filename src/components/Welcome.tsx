import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start bg-white px-5 pt-16">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold text-center text-[#4B4B4B]">
          ¡Feliz cumpleaños!
        </h1>
        
        <div className="w-full rounded-lg bg-[rgba(137,226,25,0)] p-6 text-center">
          <p className="text-lg text-[#4B4B4B] leading-relaxed">
            This personalized Duolingo is filled with our most used idioms and expressions, beautiful anecdotes we have with you and words we think you might enjoy learning.
            <br /><br />
            Everyone has contributed to the app with their ideas and their voices, as you will very soon see.
            <br /><br />
            Our goal is to help you learn the Spanish we use and love.
            <br /><br />
            We love you Nouk! ❤️
          </p>
        </div>

        <button
          onClick={() => navigate("/profiles")}
          className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
        >
          Let's go! 🚀
        </button>
      </div>
    </div>
  );
} 
import { useNavigate } from "react-router-dom";
import TopNav from "./TopNav";
import { useEffect, useRef } from "react";

export default function FinishScreen() {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-start bg-white px-5 pt-16">
      <TopNav />
      <audio 
        ref={audioRef}
        src="https://qeqjfuppdumygnwtruyr.supabase.co/storage/v1/object/public/sounds//big%20success%20sound.mp3"
        className="hidden"
      />
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <h1 className="text-3xl font-semibold text-center text-[#4B4B4B]">
          ¡Enhorabuena! 🎉
        </h1>
        
        <div className="w-full rounded-lg bg-[rgba(137,226,25,0)] p-6 text-center">
            <p className="text-lg text-[#4B4B4B]">
              You are more than ready to put your newly acquired special Spanish sentences to the test in real life!
              <br />
              <br />
              Ahora solo queda practicar con todos nosotros! ❤️
            </p>
        </div>

        <button
          onClick={() => navigate("/sentences")}
          className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
        >
          Ver todas las frases
        </button>
      </div>
    </div>
  );
} 
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
          Félicitations ! 🎉
        </h1>
        
        <div className="w-full rounded-lg bg-[rgba(137,226,25,0)] p-6 text-center">
          <p className="text-lg text-[#4B4B4B]">
            Ahora que ya conoces tus frases favoritas... estas más que preparada para poner a prueba tu francés en vivo y en directo!
            <br />
            <br />
            Pásalo fenomenal, disfruta del viaje y como tú nos dices siempre... manda muchas fotos!!! 🇫🇷 😘
          </p>
        </div>

        <button
          onClick={() => navigate("/sentences")}
          className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
        >
          Voir toutes les phrases
        </button>
      </div>
    </div>
  );
} 
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Splash() {
  const navigate = useNavigate();
  const [audioUrl, setAudioUrl] = useState('');

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
        {sentence.audioUrl && (
          <p className="text-sm text-gray-500 mt-1">
            Audio: <a href={sentence.audioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Escuchar</a>
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL del Audio
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="URL del audio (opcional)"
            />
            {audioUrl && (
              <audio controls className="w-full mt-2">
                <source src={audioUrl} type="audio/mpeg" />
                Tu navegador no soporta el elemento de audio.
              </audio>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

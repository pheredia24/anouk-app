import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import TopNav from "./TopNav";
import Spinner from "./Spinner";
import { useNavigate, useLocation } from "react-router-dom";

export default function ExerciseList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSentenceId, setExpandedSentenceId] = useState<string | null>(null);
  const [isSpanishExplanation, setIsSpanishExplanation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get all sentences
  const sentences = useQuery(api.sentences.listAll) || [];
  const isFromFinish = location.state?.fromFinish;

  const handleSentenceClick = (sentenceId: string) => {
    setExpandedSentenceId(expandedSentenceId === sentenceId ? null : sentenceId);
    setIsSpanishExplanation(false); // Reset language preference when toggling
  };

  const handleReplay = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const getSentenceTypeLabel = (type: string | undefined) => {
    switch (type) {
      case 'anecdote':
        return 'Anécdota';
      case 'classic_sentence':
        return 'Frase Clásica';
      case 'favourite_sentence':
        return 'Frase Favorita';
      default:
        return null;
    }
  };

  if (!sentences.length) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="absolute top-6 left-4">
        <TopNav />
      </div>
      <div className="flex-1 flex flex-col pt-24 px-4 pb-12 max-w-3xl mx-auto w-full overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Todas las frases</h1>
          {!isFromFinish && (
            <button
              onClick={() => navigate("/create")}
              className="rounded-full bg-[#58CC02] text-white py-2 px-4 text-base font-semibold hover:bg-[#89E219] transition-colors"
            >
              Añadir frase
            </button>
          )}
        </div>
        
        {/* Hidden audio element for playing sounds */}
        <audio ref={audioRef} className="hidden" />

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {sentences.map((sentence) => {
            const isExpanded = expandedSentenceId === sentence._id;
            const typeLabel = getSentenceTypeLabel(sentence.type);

            return (
              <div
                key={sentence._id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleSentenceClick(sentence._id)}
                  className="w-full p-4 text-left flex items-start justify-between"
                >
                  <div className="flex-1">
                    {typeLabel && (
                      <div className="text-sm text-gray-500 mb-2 italic">
                        {typeLabel}
                      </div>
                    )}
                    <div className="font-medium">
                      {sentence.text}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sentence.translation}
                    </div>
                  </div>
                  {sentence.audioUrl && (
                    <span className="text-gray-400 ml-2">🔊</span>
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    {/* Explanation */}
                    {(sentence.explanation || sentence.explanationTranslated) && (
                      <div>
                        <div className="text-gray-700 text-lg leading-relaxed">
                          {isSpanishExplanation
                            ? sentence.explanationTranslated
                            : sentence.explanation}
                        </div>
                      </div>
                    )}

                    {/* Bottom row with audio and language toggle */}
                    <div className="mt-4 flex items-center justify-between">
                      {/* Audio player */}
                      {sentence.audioUrl && (
                        <button
                          onClick={() => sentence.audioUrl && handleReplay(sentence.audioUrl)}
                          className="py-0 px-1 rounded-full bg-white shadow-md hover:shadow-lg opacity-80"
                          aria-label="Escuchar el audio"
                        >
                          <span className="text-lg">
                            🔊
                          </span>
                        </button>
                      )}

                      {/* Language toggle */}
                      {sentence.explanation && sentence.explanationTranslated && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSpanishExplanation(prev => !prev);
                          }}
                          className="py-0 px-1 rounded-full bg-white shadow-md hover:shadow-lg opacity-80"
                          aria-label={isSpanishExplanation ? "Ver en inglés" : "Ver en español"}
                        >
                          <span className="text-xl">
                            {isSpanishExplanation ? "🇬🇧" : "🇪🇸"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
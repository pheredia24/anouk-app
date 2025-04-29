import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import TopNav from "./TopNav";
import Spinner from "./Spinner";

export default function ExerciseList() {
  const [expandedSentenceId, setExpandedSentenceId] = useState<string | null>(null);
  const [isSpanishExplanation, setIsSpanishExplanation] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Get all sentences
  const sentences = useQuery(api.sentences.listAll) || [];

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

  if (!sentences.length) {
    return <Spinner />;
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-white">
      <div className="absolute top-6 left-4">
        <TopNav />
      </div>
      <div className="flex-1 flex flex-col pt-24 px-4 pb-12 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-12">Toutes les phrases</h1>
        
        {/* Hidden audio element for playing sounds */}
        <audio ref={audioRef} className="hidden" />

        <div className="space-y-4">
          {sentences.map((sentence) => {
            const isExpanded = expandedSentenceId === sentence._id;

            return (
              <div
                key={sentence._id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleSentenceClick(sentence._id)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {sentence.text}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sentence.translation}
                    </div>
                  </div>
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="border-t px-4 py-3 bg-gray-50">
                    {/* Explanation */}
                    {(sentence.explanation || sentence.explanation_spanish) && (
                      <div>
                        <div className="text-gray-700 text-lg leading-relaxed">
                          {isSpanishExplanation
                            ? sentence.explanation_spanish
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
                          aria-label="Écouter l'audio"
                        >
                          <span className="text-lg">
                            🔊
                          </span>
                        </button>
                      )}

                      {/* Language toggle */}
                      {sentence.explanation && sentence.explanation_spanish && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsSpanishExplanation(prev => !prev);
                          }}
                          className="py-0 px-1 rounded-full bg-white shadow-md hover:shadow-lg opacity-80"
                          aria-label={isSpanishExplanation ? "Voir en français" : "Ver en español"}
                        >
                          <span className="text-xl">
                            {isSpanishExplanation ? "🇫🇷" : "🇪🇸"}
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
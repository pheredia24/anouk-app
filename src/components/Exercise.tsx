import { useNavigate } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRef, useEffect, useCallback, useState } from "react";
import { toast } from "sonner";
import { useAppStore } from "../lib/store";
import TopNav from "./TopNav";
import Spinner from "./Spinner";
import ProgressBar from "./exercise/ProgressBar";
import WordBank from "./exercise/WordBank";
import SelectedWords from "./exercise/SelectedWords";
import AudioPlayer from "./exercise/AudioPlayer";
import ExplanationBox from "./exercise/ExplanationBox";
import { useExerciseState } from "../hooks/useExerciseState";
import { useExerciseData } from "../hooks/useExerciseData";
import { useConfetti } from "../hooks/useConfetti";
import { useSoundEffects } from "../hooks/useSoundEffects";

// Helper function to process words and punctuation (duplicated from useExerciseData for direct access)
function processWords(text: string): string[] {
  const rawWords = text.split(/\s+/);
  const processedWords: string[] = [];
  
  for (let i = 0; i < rawWords.length; i++) {
    const currentWord = rawWords[i];
    if ((currentWord === '!' || currentWord === '?') && processedWords.length > 0) {
      processedWords[processedWords.length - 1] += currentWord;
    } else {
      processedWords.push(currentWord);
    }
  }
  
  return processedWords;
}

export default function Exercise() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const didRunRestore = useRef(false);
  const fireConfetti = useConfetti(200);
  const { playCorrect, playIncorrect } = useSoundEffects();

  const selectedProfileId = useAppStore((s) => s.selectedProfileId);
  const saveProgress = useMutation(api.userProgress.saveProgress);

  const {
    state: { selectedWords, isCorrect, isSpanishExplanation, isSaving, revealedHints, errorCount },
    actions: { handleWordClick, handleWordRemove, handleCorrect, toggleLanguage, reset, resetWords, startSaving, handleSaveError, handleSaveSuccess, revealHint, incrementError, setSelectedWords }
  } = useExerciseState();

  if (!selectedProfileId) {
    navigate("/profiles", { replace: true });
    return null;
  }

  const { exercises, lastCompletedExercise, currentExercise, sentence, shuffledWords } =
    useExerciseData(selectedProfileId, currentIndex);

  useEffect(() => {
    if (didRunRestore.current || exercises.length === 0) return;
    if (!lastCompletedExercise) {
      didRunRestore.current = true;
      return;
    }
    const next = exercises.findIndex((ex) => ex._id === lastCompletedExercise._id) + 1;
    if (next < exercises.length) {
      setCurrentIndex(next);
    }
    didRunRestore.current = true;
  }, [lastCompletedExercise, exercises]);

  useEffect(() => {
    didRunRestore.current = false;
  }, [selectedProfileId]);

  const getWordLimit = useCallback(
    (word: string, isDistractor: boolean) =>
      isDistractor
        ? 1
        : (processWords(sentence?.translation || "").filter((w) => w === word).length || 0),
    [sentence?.translation]
  );

  const handleCheck = useCallback(async () => {
    if (!selectedProfileId || !currentExercise || !sentence) return;
    
    // Process both the answer and expected translation
    const processedAnswer = processWords(selectedWords.join(" ")).join(" ");
    const processedTranslation = processWords(sentence.translation).join(" ");
    
    const correct =
      processedAnswer.toLocaleLowerCase("fr-FR") === processedTranslation.toLocaleLowerCase("fr-FR");

    startSaving();
    try {
      if (correct) {
        handleCorrect(currentExercise._id);
        await saveProgress({ profileId: selectedProfileId, exerciseId: currentExercise._id });
        handleSaveSuccess();
        toast.success(
          <div className="text-center text-base font-medium py-2 px-4">
            Très bien! 🥳
          </div>,
          {
            duration: 2000,
          }
        );
        playCorrect();
        fireConfetti();
      } else {
        incrementError();
        playIncorrect();
        // Show "Fucking man!" message only 20% of the time
        const message = Math.random() < 0.2 
          ? "Fucking man ! Mauvaise réponse, réessayez !"
          : "Mauvaise réponse, réessayez !";
          toast.error(
            <div className="text-center text-base font-medium py-2 px-4">
              {message}
            </div>,
            {
              duration: 2000,
            }
          );
        handleSaveError("Réponse incorrecte");
      }
    } catch {
      toast.error("Impossible d'enregistrer la progression.");
      handleSaveError("Erreur de sauvegarde");
    }
  }, [selectedProfileId, currentExercise, sentence, selectedWords, startSaving, handleCorrect, saveProgress, handleSaveSuccess, handleSaveError, fireConfetti, playCorrect, playIncorrect, incrementError]);

  const handleNext = useCallback(() => {
    reset();
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate("/finish");
    }
  }, [currentIndex, exercises.length, navigate, reset]);

  const handleHint = useCallback(() => {
    if (!sentence) return;
    
    const correctWords = processWords(sentence.translation);
    if (revealedHints >= correctWords.length) return;

    // Find how many words from the beginning are correct
    const correctPrefix = selectedWords.reduce((count, word, index) => {
      // Compare case-insensitive
      if (index < correctWords.length && 
          word.toLowerCase() === correctWords[index].toLowerCase()) {
        return count + 1;
      }
      return count;
    }, 0);

    // Keep only the correct prefix of words
    const keptWords = selectedWords.slice(0, correctPrefix);
    
    // Find the next correct word in the shuffled words
    const nextWord = correctWords[correctPrefix];
    const wordInBank = shuffledWords.find(w => 
      w.word.toLowerCase() === nextWord.toLowerCase()
    );

    // Add the next word if found in the bank
    if (wordInBank) {
      setSelectedWords([...keptWords, wordInBank.word]);
      revealHint();
    }
  }, [sentence, selectedWords, shuffledWords, setSelectedWords, revealHint]);

  if (!currentExercise || !sentence) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-12 px-4 pb-8 flex flex-col items-center">
        <TopNav />
      <div className="w-full max-w-sm">
          <ProgressBar current={currentIndex + 1} total={exercises.length} />

        <div className="space-y-6">
            {currentExercise.mode === "lecture" && (
          <div className="text-xl font-semibold text-center">
            {sentence.text}
          </div>
            )}

          {currentExercise.mode === "audio" && sentence.audioUrl && (
              <AudioPlayer audioUrl={sentence.audioUrl} />
            )}

            <SelectedWords words={selectedWords} onWordRemove={handleWordRemove} />

            {!isCorrect && (
              <WordBank
                words={shuffledWords}
                selectedWords={selectedWords}
                onWordClick={handleWordClick}
                getWordLimit={getWordLimit}
              />
            )}

            {isCorrect === null || !isCorrect ? (
              <div className="space-y-4">
                <button
                  onClick={handleCheck}
                  disabled={isSaving || selectedWords.length === 0}
                  className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <Spinner fullScreen={false} className="!border-white h-5 w-5" /> : "Vérifier"}
                </button>

                {/* Add hint button only after 2 errors */}
                {errorCount >= 2 && sentence && revealedHints < processWords(sentence.translation).length && (
                  <button
                    onClick={handleHint}
                    className="w-full rounded-full border-2 border-[#58CC02] text-[#58CC02] py-2 px-6 text-base font-medium hover:bg-[#58CC0210] transition-colors flex items-center justify-center gap-2"
                  >
                    {revealedHints === 0 ? "Besoin d'un indice ?" : "Un autre indice ?"}
                  </button>
                )}
              </div>
            ) : (
            <div className="space-y-4">
                {(sentence.explanation || sentence.explanation_spanish) && (
                  <ExplanationBox
                    explanation={sentence.explanation || ""}
                    explanationSpanish={sentence.explanation_spanish}
                    isSpanishExplanation={isSpanishExplanation}
                    onToggleLanguage={toggleLanguage}
                  />
              )}
              <button
                onClick={handleNext}
                className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
              >
                  {currentIndex < exercises.length - 1 ? "Suivant" : "Terminer"}
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

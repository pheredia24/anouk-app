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
import WordSelector from "./exercise/WordSelector";
import { useExerciseState } from "../hooks/useExerciseState";
import { useExerciseData } from "../hooks/useExerciseData";
import { useConfetti } from "../hooks/useConfetti";
import { useSoundEffects } from "../hooks/useSoundEffects";
import { AuthorInfo } from "./exercise/AuthorInfo";

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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
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
    
    let correct = false;
    if (currentExercise.mode === "select_one_word") {
      correct = selectedWord?.toLowerCase() === sentence.translation.toLowerCase();
    } else {
      // Process both the answer and expected translation
      const processedAnswer = processWords(selectedWords.join(" ")).join(" ");
      const processedTranslation = processWords(sentence.translation).join(" ");
      correct = processedAnswer.toLowerCase() === processedTranslation.toLowerCase();
    }

    startSaving();
    try {
      if (correct) {
        handleCorrect(currentExercise._id);
        await saveProgress({ profileId: selectedProfileId, exerciseId: currentExercise._id });
        handleSaveSuccess();
        toast.success(
          <div className="text-center text-base font-medium py-2 px-4">
            ¡Muy bien! 🥳
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
        toast.error(
          <div className="text-center text-base font-medium py-2 px-4">
            ¡Inténtalo de nuevo!
          </div>,
          {
            duration: 2000,
          }
        );
        handleSaveError("Respuesta incorrecta");
      }
    } catch {
      toast.error("No se pudo guardar el progreso.");
      handleSaveError("Error al guardar");
    }
  }, [selectedProfileId, currentExercise, sentence, selectedWords, selectedWord, startSaving, handleCorrect, saveProgress, handleSaveSuccess, handleSaveError, fireConfetti, playCorrect, playIncorrect, incrementError]);

  const handleNext = useCallback(() => {
    reset();
    setSelectedWord(null);
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      navigate("/finish");
    }
  }, [currentIndex, exercises.length, navigate, reset]);

  const handleHint = useCallback(() => {
    if (!sentence) return;
    
    if (currentExercise?.mode === "select_one_word") {
      setSelectedWord(sentence.translation);
      revealHint();
    } else {
      const correctWords = processWords(sentence.translation);
      if (revealedHints >= correctWords.length) return;

      // Find how many words from the beginning are correct
      const correctPrefix = selectedWords.reduce((count, word, index) => {
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
    }
  }, [sentence, currentExercise?.mode, selectedWords, shuffledWords, setSelectedWords, revealHint]);

  if (!currentExercise || !sentence) {
    return <Spinner />;
  }

  const showHintButton = (
    errorCount >= 3 && 
    ["lecture", "audio", "audio_and_lecture"].includes(currentExercise.mode) &&
    revealedHints < processWords(sentence.translation).length
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-12 px-4 pb-8 flex flex-col items-center">
        <TopNav />
        <div className="w-full max-w-sm">
          <ProgressBar current={currentIndex + 1} total={exercises.length} />

          <div className="space-y-6">
            {(currentExercise.mode === "lecture" || currentExercise.mode === "audio_and_lecture" || currentExercise.mode === "select_one_word") && (
              <div className="flex flex-col items-center gap-2">
                <div className="text-xl font-semibold text-center">
                  {sentence.text}
                </div>
                <AuthorInfo addedBy={sentence.addedBy} />
              </div>
            )}

            {(currentExercise.mode === "audio" || currentExercise.mode === "audio_and_lecture" || currentExercise.mode === "select_one_word") && sentence.audioUrl && (
              <AudioPlayer 
                audioUrl={sentence.audioUrl} 
                autoPlay={currentExercise.mode === "audio"}
              />
            )}

            {currentExercise.mode === "select_one_word" ? (
              <WordSelector
                correctWord={sentence.translation}
                distractors={sentence.distractorWords || []}
                onSelect={setSelectedWord}
                selectedWord={selectedWord}
              />
            ) : (
              <>
                <SelectedWords words={selectedWords} onWordRemove={handleWordRemove} />
                {!isCorrect && (
                  <WordBank
                    words={shuffledWords}
                    selectedWords={selectedWords}
                    onWordClick={handleWordClick}
                    getWordLimit={getWordLimit}
                  />
                )}
              </>
            )}

            {isCorrect === null || !isCorrect ? (
              <div className="space-y-4">
                <button
                  onClick={handleCheck}
                  disabled={isSaving || (currentExercise.mode === "select_one_word" ? !selectedWord : selectedWords.length === 0)}
                  className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? <Spinner fullScreen={false} className="!border-white h-5 w-5" /> : "Enviar"}
                </button>

                {showHintButton && (
                  <button
                    onClick={handleHint}
                    className="w-full rounded-full border-2 border-[#58CC02] text-[#58CC02] py-2 px-6 text-base font-medium hover:bg-[#58CC0210] transition-colors flex items-center justify-center gap-2"
                  >
                    {revealedHints === 0 ? "¿Necesitas una pista?" : "¿Otra pista?"}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {(sentence.explanation || sentence.explanationTranslated) && (
                  <ExplanationBox
                    explanation={sentence.explanation || ""}
                    explanationSpanish={sentence.explanationTranslated}
                    isSpanishExplanation={isSpanishExplanation}
                    onToggleLanguage={toggleLanguage}
                  />
                )}
                <button
                  onClick={handleNext}
                  className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors"
                >
                  {currentIndex < exercises.length - 1 ? "Siguiente" : "Terminar"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

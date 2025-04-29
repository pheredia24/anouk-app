// src/hooks/useExerciseData.ts

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useMemo } from "react";

interface Word {
  word: string;
  index: number;
  isDistractor: boolean;
}

// Helper function to process words and punctuation
function processWords(text: string): string[] {
  // First split by spaces
  const rawWords = text.split(/\s+/);
  const processedWords: string[] = [];
  
  for (let i = 0; i < rawWords.length; i++) {
    const currentWord = rawWords[i];
    // Check if this is a standalone punctuation mark that should be merged with previous word
    if ((currentWord === '!' || currentWord === '?') && processedWords.length > 0) {
      processedWords[processedWords.length - 1] += currentWord;
    } else {
      processedWords.push(currentWord);
    }
  }
  
  return processedWords;
}

export function useExerciseData(
  selectedProfileId: Id<"profiles"> | null,
  currentIndex: number
) {
  // 1️⃣ Load & sort exercises by `order`
  const rawExercises = useQuery(api.exercises.list) || [];
  const exercises = useMemo(
    () => [...rawExercises].sort((a, b) => a.order - b.order),
    [rawExercises]
  );

  // 2️⃣ Fetch last-completed (for component restore effect)
  const lastCompletedExercise = useQuery(
    api.userProgress.getLastCompletedExercise,
    selectedProfileId ? { profileId: selectedProfileId } : "skip"
  );

  // 3️⃣ Pick the current exercise by the component-driven index
  const currentExercise = useMemo(
    () => exercises[currentIndex] || null,
    [exercises, currentIndex]
  );

  // 4️⃣ Fetch its sentence
  const sentence = useQuery(
    api.sentences.get,
    currentExercise ? { id: currentExercise.sentenceId } : "skip"
  );

  // 5️⃣ Build shuffled word list per sentence
  const shuffledWords: Word[] = useMemo(() => {
    if (!sentence?.translation) return [];
    const words = [
      ...processWords(sentence.translation),
      ...(sentence.distractorWords || []),
    ];
    return words
      .map((w, i) => ({
        word: w,
        index: i,
        isDistractor: sentence.distractorWords?.includes(w) ?? false,
      }))
      .sort(() => Math.random() - 0.5);
  }, [sentence?._id, sentence?.translation, sentence?.distractorWords]);

  return {
    exercises,
    lastCompletedExercise,
    currentExercise,
    sentence,
    shuffledWords,
  };
}
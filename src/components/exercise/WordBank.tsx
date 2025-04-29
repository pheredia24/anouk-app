import { FC } from 'react';

interface Word {
  word: string;
  index: number;
  isDistractor: boolean;
}

interface WordBankProps {
  words: Word[];
  selectedWords: string[];
  onWordClick: (word: string, index: number) => void;
  getWordLimit: (word: string, isDistractor: boolean) => number;
}

const WordBank: FC<WordBankProps> = ({ words, selectedWords, onWordClick, getWordLimit }) => {
  const countWordOccurrences = (word: string, words: string[]) => {
    return words.filter(w => w === word).length;
  };

  if (!words.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {words.map(({ word, index, isDistractor }) => {
        const selectedCount = countWordOccurrences(word, selectedWords);
        const wordLimit = getWordLimit(word, isDistractor);
        const isDisabled = selectedCount >= wordLimit;

        return (
          <button
            key={`available-${word}-${index}`}
            onClick={() => onWordClick(word, index)}
            disabled={isDisabled}
            className={`px-4 py-2 rounded-full text-lg ${
              isDisabled
                ? "bg-gray-200 text-gray-400"
                : "bg-white shadow hover:shadow-md text-gray-700"
            }`}
            aria-pressed={selectedCount > 0}
            aria-label={`Ajouter le mot ${word}`}
          >
            {word}
          </button>
        );
      })}
    </div>
  );
};

export default WordBank; 
import { useMemo } from 'react';

interface WordSelectorProps {
  correctWord: string;
  distractors: string[];
  onSelect: (word: string) => void;
  selectedWord: string | null;
}

export default function WordSelector({ correctWord, distractors, onSelect, selectedWord }: WordSelectorProps) {
  // Combine and shuffle options only when inputs change
  const allOptions = useMemo(() => {
    return [...distractors, correctWord]
      .sort(() => Math.random() - 0.5);
  }, [distractors, correctWord]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {allOptions.map((word) => (
        <button
          key={word}
          onClick={() => onSelect(word)}
          className={`
            p-3 rounded-lg border-2 transition-all text-lg font-medium
            ${selectedWord === word 
              ? 'border-[#58CC02] bg-[#58CC0210] text-[#58CC02]' 
              : 'border-gray-200 hover:border-[#58CC02] text-gray-700'
            }
          `}
        >
          {word}
        </button>
      ))}
    </div>
  );
} 
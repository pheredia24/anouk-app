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
    <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Selecciona la palabra correcta">
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
          role="radio"
          aria-checked={selectedWord === word}
          // Prevent auto-focus
          tabIndex={-1}
          // Only allow focus when navigating with keyboard
          onFocus={(e) => {
            if (e.target.matches(':focus-visible')) {
              e.target.tabIndex = 0;
            }
          }}
          onBlur={(e) => {
            e.target.tabIndex = -1;
          }}
        >
          {word}
        </button>
      ))}
    </div>
  );
} 
import { FC } from 'react';

interface SelectedWordsProps {
  words: string[];
  onWordRemove: (index: number) => void;
}

const SelectedWords: FC<SelectedWordsProps> = ({ words, onWordRemove }) => {
  return (
    <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded-lg" role="list">
      <div className="flex flex-wrap gap-3">
        {words.map((word, index) => (
          <button
            key={`selected-${word}-${index}`}
            onClick={() => onWordRemove(index)}
            className="px-4 py-2 text-lg bg-[#58CC02] text-white rounded-full hover:bg-[#4CAF00] transition-colors"
            aria-label={`Retirer le mot ${word}`}
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SelectedWords; 
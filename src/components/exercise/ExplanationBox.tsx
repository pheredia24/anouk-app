import { FC } from 'react';

interface ExplanationBoxProps {
  explanation: string;
  explanationSpanish?: string;
  isSpanishExplanation: boolean;
  onToggleLanguage: () => void;
}

const ExplanationBox: FC<ExplanationBoxProps> = ({
  explanation,
  explanationSpanish,
  isSpanishExplanation,
  onToggleLanguage,
}) => {
  if (!explanation && !explanationSpanish) return null;

  return (
    <div className="px-4 pt-4 pb-12 bg-gray-50 rounded-lg text-gray-700 text-lg leading-relaxed relative">
      {explanation && explanationSpanish && (
        <button
          onClick={onToggleLanguage}
          className="absolute bottom-2 right-2 py-0 px-1 rounded-full bg-white shadow-md hover:shadow-lg opacity-80"
          aria-label={isSpanishExplanation ? "Voir en français" : "Ver en español"}
        >
          <span className="text-xl">
            {isSpanishExplanation ? "🇫🇷" : "🇪🇸"}
          </span>
        </button>
      )}
      {isSpanishExplanation ? explanationSpanish : explanation}
    </div>
  );
};

export default ExplanationBox; 
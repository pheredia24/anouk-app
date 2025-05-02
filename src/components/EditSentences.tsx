import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TopNav from './TopNav';
import { toast } from 'sonner';
import { Doc } from '../../convex/_generated/dataModel';
import { AuthorInfo } from './exercise/AuthorInfo';

interface EditableSentenceProps {
  sentence: Doc<'sentences'>;
  onSave: () => void;
}

// Helper function to split sentence into words
function getWords(text: string): string[] {
  return text.split(/\s+/);
}

function EditableSentence({ sentence, onSave }: EditableSentenceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(sentence.text);
  const [translation, setTranslation] = useState(sentence.translation);
  const [explanation, setExplanation] = useState(sentence.explanation || '');
  const [explanationTranslated, setExplanationTranslated] = useState(sentence.explanationTranslated || '');
  const [blankWordIndices, setBlankWordIndices] = useState<number[]>(sentence.blankWordIndices || []);
  const [type, setType] = useState<"anecdote" | "classic_sentence" | "favourite_sentence" | "">(sentence.type || "");
  const [distractorWords, setDistractorWords] = useState<string[]>(sentence.distractorWords || []);
  const [isSaving, setIsSaving] = useState(false);

  const updateSentence = useMutation(api.sentences.update);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSentence({
        id: sentence._id,
        text,
        translation,
        explanation,
        explanationTranslated,
        blankWordIndices,
        type: type || undefined,
        distractorWords,
      });
      toast.success('¡Frase actualizada!');
      setIsEditing(false);
      onSave();
    } catch (error) {
      toast.error('Error al actualizar la frase');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBlankWord = (index: number) => {
    setBlankWordIndices(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleDistractorWordsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by commas and trim each word
    const words = e.target.value.split(',').map(word => word.trim()).filter(word => word !== '');
    setDistractorWords(words);
  };

  if (!isEditing) {
    return (
      <div className="p-4 border rounded-lg space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-medium">{sentence.text}</p>
            <p className="text-gray-600">
              {getWords(sentence.translation).map((word, index) => {
                const isBlank = (sentence.blankWordIndices || []).includes(index);
                return (
                  <span key={index}>
                    {index > 0 && ' '}
                    <span className={isBlank ? 'px-1 bg-yellow-100 rounded' : ''}>
                      {word}
                    </span>
                  </span>
                );
              })}
            </p>
            {sentence.type && (
              <p className="text-sm text-gray-500 mt-1">
                Tipo: {sentence.type === 'anecdote' ? 'Anécdota' : 
                       sentence.type === 'classic_sentence' ? 'Frase Clásica' : 
                       'Frase Favorita'}
              </p>
            )}
            {sentence.distractorWords && sentence.distractorWords.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Palabras distractoras: {sentence.distractorWords.join(', ')}
              </p>
            )}
          </div>
          <AuthorInfo addedBy={sentence.addedBy} />
        </div>
        
        {(sentence.explanation || sentence.explanationTranslated) && (
          <div className="pt-2 border-t space-y-1">
            {sentence.explanation && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">EN:</span> {sentence.explanation}
              </p>
            )}
            {sentence.explanationTranslated && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">ES:</span> {sentence.explanationTranslated}
              </p>
            )}
          </div>
        )}

        <button
          onClick={() => setIsEditing(true)}
          className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-600"
        >
          Editar
        </button>
      </div>
    );
  }

  const translationWords = getWords(translation);

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          English Text
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="English text"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Spanish Translation
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Spanish translation"
          />
          <div className="flex flex-wrap gap-2">
            {translationWords.map((word, index) => (
              <button
                key={index}
                onClick={() => toggleBlankWord(index)}
                className={`px-2 py-1 rounded text-sm transition-colors ${
                  blankWordIndices.includes(index)
                    ? 'bg-yellow-100 hover:bg-yellow-200'
                    : 'hover:bg-gray-100'
                }`}
                type="button"
              >
                {word}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Click on words to mark them as blanks for fill-in-the-blank exercises
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Palabras Distractoras
        </label>
        <textarea
          value={distractorWords.join(', ')}
          onChange={handleDistractorWordsChange}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="Escribe palabras distractoras separadas por comas"
        />
        <p className="text-sm text-gray-500 mt-1">
          Escribe palabras distractoras separadas por comas para ejercicios de selección múltiple
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explanation (English)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="English explanation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Explicación (Español)
        </label>
        <textarea
          value={explanationTranslated}
          onChange={(e) => setExplanationTranslated(e.target.value)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={2}
          placeholder="Spanish explanation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Frase
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Selecciona un tipo (opcional)</option>
          <option value="anecdote">Anécdota</option>
          <option value="classic_sentence">Frase Clásica</option>
          <option value="favourite_sentence">Frase Favorita</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          disabled={isSaving}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default function EditSentences() {
  const sentences = useQuery(api.sentences.listAll) || [];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-12 px-4 pb-8 flex flex-col items-center">
        <TopNav />
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-8">Editar Frases</h1>
          
          <div className="space-y-4">
            {sentences.map((sentence) => (
              <EditableSentence
                key={sentence._id}
                sentence={sentence}
                onSave={() => {}}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
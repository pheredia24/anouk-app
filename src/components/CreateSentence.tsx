import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import TopNav from './TopNav';
import { toast } from 'sonner';
import { Id } from '../../convex/_generated/dataModel';

export default function CreateSentence() {
  // Sentence form state
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState('');
  const [explanation, setExplanation] = useState('');
  const [explanationTranslated, setExplanationTranslated] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [distractorWords, setDistractorWords] = useState('');
  const [addedBy, setAddedBy] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Exercise form state
  const [selectedSentenceId, setSelectedSentenceId] = useState<Id<"sentences"> | null>(null);
  const [exerciseMode, setExerciseMode] = useState<'lecture' | 'audio' | 'audio_and_lecture' | 'select_one_word'>('lecture');
  const [isSubmittingExercise, setIsSubmittingExercise] = useState(false);

  // Fetch all sentences for exercise creation
  const sentences = useQuery(api.sentences.listAll) || [];
  
  const createSentence = useMutation(api.sentences.create);
  const createExercise = useMutation(api.exercises.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createSentence({
        text: translation, // English text goes to text field
        translation: text, // Spanish text goes to translation field
        explanation,
        explanationTranslated,
        audioUrl,
        addedBy,
        distractorWords: distractorWords.split(',').map(w => w.trim()).filter(Boolean)
      });

      // Reset form
      setText('');
      setTranslation('');
      setExplanation('');
      setExplanationTranslated('');
      setAudioUrl('');
      setDistractorWords('');
      setAddedBy('');

      toast.success('¡Frase creada con éxito!');
    } catch (error) {
      toast.error('Error al crear la frase');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSentenceId) return;
    
    setIsSubmittingExercise(true);

    try {
      await createExercise({
        sentenceId: selectedSentenceId,
        mode: exerciseMode,
      });

      // Reset form
      setSelectedSentenceId(null);
      setExerciseMode('lecture');

      toast.success('¡Ejercicio creado con éxito!');
    } catch (error) {
      toast.error('Error al crear el ejercicio');
      console.error(error);
    } finally {
      setIsSubmittingExercise(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="pt-12 px-4 pb-8 flex flex-col items-center">
        <TopNav />
        <div className="w-full max-w-2xl">
          <h1 className="text-2xl font-bold text-center mb-8">Crear Nueva Frase</h1>

          <form onSubmit={handleSubmit} className="space-y-6 mb-12">
            <div>
              <label htmlFor="translation" className="block text-sm font-medium text-gray-700 mb-1">
                Texto en Español
              </label>
              <input
                type="text"
                id="translation"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                placeholder="Escribe la frase en español"
              />
            </div>

            <div>
              <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                Traducción al Inglés
              </label>
              <input
                type="text"
                id="text"
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                placeholder="Write the English translation"
              />
            </div>

            <div>
              <label htmlFor="explanation" className="block text-sm font-medium text-gray-700 mb-1">
                Explicación en Inglés
              </label>
              <textarea
                id="explanation"
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                rows={3}
                placeholder="Write the explanation in English"
              />
            </div>

            <div>
              <label htmlFor="explanationTranslated" className="block text-sm font-medium text-gray-700 mb-1">
                Explicación en Español
              </label>
              <textarea
                id="explanationTranslated"
                value={explanationTranslated}
                onChange={(e) => setExplanationTranslated(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                rows={3}
                placeholder="Escribe la explicación en español"
              />
            </div>

            <div>
              <label htmlFor="audioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL del Audio
              </label>
              <input
                type="url"
                id="audioUrl"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                placeholder="https://example.com/audio.mp3"
              />
            </div>

            <div>
              <label htmlFor="distractorWords" className="block text-sm font-medium text-gray-700 mb-1">
                Palabras Distractoras (separadas por comas)
              </label>
              <input
                type="text"
                id="distractorWords"
                value={distractorWords}
                onChange={(e) => setDistractorWords(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                placeholder="word1, word2, word3"
              />
            </div>

            <div>
              <label htmlFor="addedBy" className="block text-sm font-medium text-gray-700 mb-1">
                Añadido por
              </label>
              <input
                type="text"
                id="addedBy"
                value={addedBy}
                onChange={(e) => setAddedBy(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                placeholder="Tu nombre"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creando...' : 'Crear Frase'}
            </button>
          </form>

          <div className="border-t pt-12">
            <h2 className="text-2xl font-bold text-center mb-8">Crear Nuevo Ejercicio</h2>
            
            <form onSubmit={handleExerciseSubmit} className="space-y-6">
              <div>
                <label htmlFor="sentenceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Seleccionar Frase
                </label>
                <select
                  id="sentenceId"
                  value={selectedSentenceId || ''}
                  onChange={(e) => setSelectedSentenceId(e.target.value as Id<"sentences">)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                >
                  <option value="">Selecciona una frase</option>
                  {sentences.map((sentence) => (
                    <option key={sentence._id} value={sentence._id}>
                      {sentence.translation} - {sentence.text}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">
                  Modo de Ejercicio
                </label>
                <select
                  id="mode"
                  value={exerciseMode}
                  onChange={(e) => setExerciseMode(e.target.value as typeof exerciseMode)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#58CC02] focus:border-transparent"
                >
                  <option value="lecture">Lectura</option>
                  <option value="audio">Audio</option>
                  <option value="audio_and_lecture">Audio y Lectura</option>
                  <option value="select_one_word">Seleccionar Palabra</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmittingExercise || !selectedSentenceId}
                className="w-full rounded-full bg-[#58CC02] text-white py-3 px-6 text-lg font-semibold hover:bg-[#89E219] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingExercise ? 'Creando...' : 'Crear Ejercicio'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Doc } from '../../../convex/_generated/dataModel';
import { GripVertical } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { AuthorInfo } from './AuthorInfo';

interface Props {
  id: Doc<'exercises'>['_id'];
  sentence: Doc<'sentences'>;
  mode: Doc<'exercises'>['mode'];
  order: number;
}

export function SortableExerciseItem({ id, sentence, mode, order }: Props) {
  const updateMode = useMutation(api.exercises.updateMode);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  const handleModeChange = async (newMode: typeof mode) => {
    try {
      await updateMode({ id, mode: newMode });
      toast.success('Modo actualizado');
    } catch (error) {
      console.error('Error updating mode:', error);
      toast.error('Error al actualizar el modo');
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 py-1.5 px-2 bg-white rounded border text-sm
        ${isDragging ? 'border-blue-500 shadow-sm' : 'border-gray-200'}
      `}
    >
      <button
        {...attributes}
        {...listeners}
        className="touch-none p-0.5 hover:bg-gray-100 rounded"
        aria-label="Reorder exercise"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <span className="text-xs font-medium text-gray-500">#{order + 1}</span>
      
      <select
        value={mode}
        onChange={(e) => handleModeChange(e.target.value as typeof mode)}
        className="text-xs px-1.5 py-0.5 bg-gray-100 rounded border-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="lecture">Read</option>
        <option value="audio">Audio</option>
        <option value="audio_and_lecture">A+R</option>
        <option value="select_one_word">Select</option>
      </select>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className="font-medium truncate">{sentence.text}</p>
        <span className="text-gray-400">·</span>
        <p className="text-gray-500 truncate">{sentence.translation}</p>
      </div>

      <AuthorInfo addedBy={sentence.addedBy} />
    </div>
  );
} 
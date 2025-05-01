import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Doc } from '../../../convex/_generated/dataModel';
import { GripVertical } from 'lucide-react';

interface Props {
  id: Doc<'exercises'>['_id'];
  sentence: Doc<'sentences'>;
  mode: Doc<'exercises'>['mode'];
  order: number;
}

export function SortableExerciseItem({ id, sentence, mode, order }: Props) {
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
      
      <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded">
        {mode === 'select_one_word' ? 'Select' : mode === 'lecture' ? 'Read' : mode === 'audio' ? 'Audio' : 'A+R'}
      </span>

      <div className="flex-1 min-w-0 flex items-center gap-2">
        <p className="font-medium truncate">{sentence.text}</p>
        <span className="text-gray-400">·</span>
        <p className="text-gray-500 truncate">{sentence.translation}</p>
      </div>
    </div>
  );
} 
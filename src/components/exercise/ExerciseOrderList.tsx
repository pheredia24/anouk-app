import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableExerciseItem } from '../exercise/SortableExerciseItem';
import Spinner from '../Spinner';

export default function ExerciseOrderList() {
  const exercises = useQuery(api.exercises.list) || [];
  const sentences = useQuery(api.sentences.listAll) || [];
  const updateExerciseOrder = useMutation(api.exercises.updateOrder);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) return;

    setIsReordering(true);
    
    try {
      const oldIndex = exercises.findIndex((exercise) => exercise._id === active.id);
      const newIndex = exercises.findIndex((exercise) => exercise._id === over.id);

      const newExercises = arrayMove(exercises, oldIndex, newIndex);
      
      // Update orders in the database
      await Promise.all(
        newExercises.map((exercise, index) =>
          updateExerciseOrder({
            id: exercise._id,
            order: index,
          })
        )
      );
    } catch (error) {
      console.error('Error reordering exercises:', error);
    } finally {
      setIsReordering(false);
    }
  };

  if (!exercises.length || !sentences.length) {
    return <Spinner />;
  }

  // Sort exercises by order
  const sortedExercises = [...exercises].sort((a, b) => a.order - b.order);

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Reordenar Ejercicios</h2>
      
      <div className="relative">
        {isReordering && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <Spinner fullScreen={false} />
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedExercises.map((e) => e._id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {sortedExercises.map((exercise) => {
                const sentence = sentences.find((s) => s._id === exercise.sentenceId);
                if (!sentence) return null;

                return (
                  <SortableExerciseItem
                    key={exercise._id}
                    id={exercise._id}
                    sentence={sentence}
                    mode={exercise.mode}
                    order={exercise.order}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
} 
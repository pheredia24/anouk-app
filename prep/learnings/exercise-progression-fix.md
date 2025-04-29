# Exercise Progression Bug Fix

## The Issue

We encountered two related issues in the exercise progression system:

1. **Exercise State Confusion**: After completing an exercise (e.g., exercise 5), the application would prematurely show the content and explanation of the next exercise (exercise 6) before the user clicked "Suivant". Then, clicking "Suivant" would skip to exercise 7.

2. **Progress Loss on Refresh**: When fixing the first issue, we accidentally removed the progress restoration code, causing users to lose their progress when refreshing the page.

## Root Cause Analysis

The root causes were:

1. **Query Timing and Cache Updates**: Convex's cache updates and query refetches were happening before our local state updates were complete, causing premature updates to the exercise content.

2. **Progress Restoration Interference**: The progress restoration code was running multiple times, including after saving progress for a completed exercise, causing exercise skipping.

## The Solution

We implemented a two-part solution:

### 1. State Management for Exercise Progression

```typescript
// Track completed exercise separately from current exercise
const [completedExerciseId, setCompletedExerciseId] = useState<string | null>(null);

// Update state only after progress is saved
const handleCheck = useCallback(() => {
  if (!sentence || !selectedProfileId || !currentExercise) return;
  
  const answer = selectedWords.join(" ");
  const isAnswerCorrect = answer.toLowerCase() === sentence.translation.toLowerCase();
  
  if (isAnswerCorrect) {
    saveProgress({
      profileId: selectedProfileId,
      exerciseId: currentExercise._id,
    }).then(() => {
      setCompletedExerciseId(currentExercise._id);
      setIsCorrect(true);
    });
  }
}, [selectedWords, sentence, selectedProfileId, currentExercise, saveProgress]);
```

### 2. One-time Progress Restoration

```typescript
// Use a ref to track if we've restored progress
const hasRestoredProgress = useRef(false);

// Restore progress only once when component mounts
useEffect(() => {
  if (!hasRestoredProgress.current && lastCompletedExercise && exercises.length > 0) {
    const lastIndex = exercises.findIndex(
      (ex) => ex._id === lastCompletedExercise._id
    );
    if (lastIndex !== -1 && lastIndex + 1 < exercises.length) {
      setCurrentIndex(lastIndex + 1);
      hasRestoredProgress.current = true;
    }
  }
}, [lastCompletedExercise?._id, exercises.length]);

// Reset progress restoration flag when profile changes
useEffect(() => {
  hasRestoredProgress.current = false;
}, [selectedProfileId]);
```

## Key Learnings

1. **State Management**: 
   - Keep completed exercise state separate from current exercise state
   - Wait for mutations to complete before updating local state
   - Use refs to track one-time operations

2. **Data Synchronization**:
   - Be careful with query refetches and cache updates
   - Consider the timing of state updates in relation to data fetching
   - Use proper dependency arrays in effects

3. **Progress Restoration**:
   - Implement one-time operations using refs
   - Reset flags when context changes (e.g., profile changes)
   - Keep restoration logic isolated from regular progression logic

4. **Debugging Approach**:
   - Use focused logging to track state changes
   - Monitor the sequence of events
   - Consider multiple user flows (normal progression, page refresh, profile changes)

## Testing Considerations

When testing similar features, ensure to verify:

1. Normal exercise progression
2. Progress restoration after page refresh
3. Proper state management during exercise completion
4. Profile changes and their effect on progress
5. Edge cases like completing the last exercise

## Future Improvements

Consider implementing:

1. Loading states during progress restoration
2. Error handling for failed progress saves
3. Progress indicators for the current session
4. Offline support for progress tracking 
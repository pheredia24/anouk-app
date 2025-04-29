# Hint Functionality in Bealingo

## Overview
The hint functionality helps users who are stuck by progressively revealing the correct translation word by word. It becomes available after 2 incorrect attempts and ensures that users maintain their progress by keeping correct words they've already placed.

## Key Components

### 1. Activation Conditions
The hint button appears only after 2 incorrect attempts and when there are still words to reveal:

```tsx
{errorCount >= 2 && sentence && revealedHints < processWords(sentence.translation).length && (
  <button
    onClick={handleHint}
    className="w-full rounded-full border-2 border-[#58CC02] text-[#58CC02] py-2 px-6 text-base font-medium hover:bg-[#58CC0210] transition-colors"
  >
    {revealedHints === 0 ? "Besoin d'un indice ?" : "Un autre indice ?"}
  </button>
)}
```

### 2. State Management
The hint system uses several state variables managed by the `useExerciseState` hook:

```typescript
interface State {
  // ... other state properties ...
  revealedHints: number;    // Number of hints revealed so far
  errorCount: number;       // Number of incorrect attempts
  selectedWords: string[];  // Currently selected words
}
```

### 3. Hint Logic Implementation
The `handleHint` function implements the core hint logic:

```typescript
const handleHint = useCallback(() => {
  if (!sentence) return;
  
  const correctWords = processWords(sentence.translation);
  if (revealedHints >= correctWords.length) return;

  // Find how many words from the beginning are correct
  const correctPrefix = selectedWords.reduce((count, word, index) => {
    // Compare case-insensitive
    if (index < correctWords.length && 
        word.toLowerCase() === correctWords[index].toLowerCase()) {
      return count + 1;
    }
    return count;
  }, 0);

  // Keep only the correct prefix of words
  const keptWords = selectedWords.slice(0, correctPrefix);
  
  // Find the next correct word in the shuffled words
  const nextWord = correctWords[correctPrefix];
  const wordInBank = shuffledWords.find(w => 
    w.word.toLowerCase() === nextWord.toLowerCase()
  );

  // Add the next word if found in the bank
  if (wordInBank) {
    setSelectedWords([...keptWords, wordInBank.word]);
    revealHint();
  }
}, [sentence, selectedWords, shuffledWords, setSelectedWords, revealHint]);
```

## How It Works

1. **Activation**:
   - The hint button appears after 2 incorrect attempts (`errorCount >= 2`)
   - It remains visible as long as there are words left to reveal (`revealedHints < total words`)

2. **Word Processing**:
   - The sentence translation is split into words using the `processWords` function
   - This function handles special cases like punctuation:
   ```typescript
   function processWords(text: string): string[] {
     const rawWords = text.split(/\s+/);
     const processedWords: string[] = [];
     
     for (let i = 0; i < rawWords.length; i++) {
       const currentWord = rawWords[i];
       if ((currentWord === '!' || currentWord === '?') && processedWords.length > 0) {
         processedWords[processedWords.length - 1] += currentWord;
       } else {
         processedWords.push(currentWord);
       }
     }
     
     return processedWords;
   }
   ```

3. **Hint Generation Process**:
   a. **Find Correct Prefix**:
      - Counts how many words at the beginning are already correct
      - Uses case-insensitive comparison to be user-friendly
   
   b. **Keep Correct Progress**:
      - Retains only the correct words from the beginning
      - Removes any incorrect words that come after
   
   c. **Find Next Word**:
      - Identifies the next word in the correct translation
      - Locates this word in the available word bank
   
   d. **Update Selection**:
      - Updates the selected words in a single operation
      - Increments the hint counter

4. **State Updates**:
   - Uses `setSelectedWords` for efficient state updates
   - Increments `revealedHints` to track progress
   - All updates are done in a single render cycle to prevent UI blocking

## Performance Considerations

The implementation is optimized for performance in several ways:

1. **Single State Update**:
   - Uses a single `setSelectedWords` call instead of multiple individual updates
   - Prevents unnecessary re-renders

2. **Efficient Array Operations**:
   - Uses `slice` for efficient array manipulation
   - Avoids repeated array mutations

3. **Memoization**:
   - The `handleHint` function is memoized using `useCallback`
   - Dependencies are properly tracked to ensure correct updates

## User Experience

The hint system is designed to be:
- Progressive: reveals one word at a time
- Preservative: maintains correct progress
- Helpful: shows the next correct word
- Non-disruptive: keeps the exercise flow smooth
- Encouraging: helps users move forward when stuck

This implementation balances helping users progress while maintaining the learning experience and ensuring smooth performance. 
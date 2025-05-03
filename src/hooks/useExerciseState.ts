import { useReducer, useCallback } from 'react';
import { Id } from '../../convex/_generated/dataModel';

interface ExerciseState {
  selectedWords: string[];
  isCorrect: boolean | null;
  isSpanishExplanation: boolean;
  isSaving: boolean;
  error: string | null;
  exerciseId: Id<'exercises'> | null;
  revealedHints: number;
  errorCount: number;
  blankIndices: number[];
}

type ExerciseAction =
  | { type: 'SELECT_WORD'; word: string; blankIndex: number }
  | { type: 'REMOVE_WORD'; index: number }
  | { type: 'SET_CORRECT'; exerciseId: Id<'exercises'> }
  | { type: 'TOGGLE_LANGUAGE' }
  | { type: 'RESET' }
  | { type: 'RESET_WORDS' }
  | { type: 'START_SAVING' }
  | { type: 'SAVE_ERROR'; error: string }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'REVEAL_HINT' }
  | { type: 'INCREMENT_ERROR' }
  | { type: 'SET_SELECTED_WORDS'; words: string[] }
  | { type: 'SET_BLANK_INDICES'; indices: number[] };

const initialState: ExerciseState = {
  selectedWords: [],
  isCorrect: null,
  isSpanishExplanation: true,
  isSaving: false,
  error: null,
  exerciseId: null,
  revealedHints: 0,
  errorCount: 0,
  blankIndices: [],
};

function reducer(state: ExerciseState, action: ExerciseAction): ExerciseState {
  switch (action.type) {
    case 'SELECT_WORD':
      if (state.blankIndices.length > 0) {
        const nextBlankIndex = state.selectedWords.length;
        if (nextBlankIndex >= state.blankIndices.length) {
          return state;
        }
        if (state.blankIndices[nextBlankIndex] !== action.blankIndex) {
          return state;
        }
      }
      return {
        ...state,
        selectedWords: [...state.selectedWords, action.word],
      };
    case 'REMOVE_WORD':
      return {
        ...state,
        selectedWords: state.selectedWords.slice(0, action.index),
      };
    case 'SET_BLANK_INDICES':
      return {
        ...state,
        blankIndices: [...action.indices].sort((a, b) => a - b),
      };
    case 'SET_CORRECT':
      return {
        ...state,
        isCorrect: true,
        exerciseId: action.exerciseId,
        isSaving: false,
        error: null,
      };
    case 'TOGGLE_LANGUAGE':
      return {
        ...state,
        isSpanishExplanation: !state.isSpanishExplanation,
      };
    case 'RESET':
      return {
        ...initialState,
      };
    case 'RESET_WORDS':
      return {
        ...state,
        selectedWords: [],
        isCorrect: null,
        exerciseId: null,
        revealedHints: 0,
      };
    case 'START_SAVING':
      return {
        ...state,
        isSaving: true,
        error: null,
      };
    case 'SAVE_ERROR':
      return {
        ...state,
        isSaving: false,
        error: action.error,
      };
    case 'SAVE_SUCCESS':
      return {
        ...state,
        isSaving: false,
        error: null,
      };
    case 'REVEAL_HINT':
      return {
        ...state,
        revealedHints: state.revealedHints + 1,
      };
    case 'INCREMENT_ERROR':
      return {
        ...state,
        errorCount: state.errorCount + 1,
      };
    case 'SET_SELECTED_WORDS':
      return {
        ...state,
        selectedWords: action.words,
      };
    default:
      return state;
  }
}

export function useExerciseState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleWordClick = useCallback((word: string, blankIndex?: number) => {
    dispatch({ type: 'SELECT_WORD', word, blankIndex: blankIndex || 0 });
  }, []);

  const handleWordRemove = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_WORD', index });
  }, []);

  const startSaving = useCallback(() => {
    dispatch({ type: 'START_SAVING' });
  }, []);

  const handleSaveError = useCallback((error: string) => {
    dispatch({ type: 'SAVE_ERROR', error });
  }, []);

  const handleSaveSuccess = useCallback(() => {
    dispatch({ type: 'SAVE_SUCCESS' });
  }, []);

  const handleCorrect = useCallback((exerciseId: Id<'exercises'>) => {
    dispatch({ type: 'SET_CORRECT', exerciseId });
  }, []);

  const toggleLanguage = useCallback(() => {
    dispatch({ type: 'TOGGLE_LANGUAGE' });
  }, []);

  const revealHint = useCallback(() => {
    dispatch({ type: 'REVEAL_HINT' });
  }, []);

  const incrementError = useCallback(() => {
    dispatch({ type: 'INCREMENT_ERROR' });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const resetWords = useCallback(() => {
    dispatch({ type: 'RESET_WORDS' });
  }, []);

  const setSelectedWords = useCallback((words: string[]) => {
    dispatch({ type: 'SET_SELECTED_WORDS', words });
  }, []);

  const setBlankIndices = useCallback((indices: number[]) => {
    dispatch({ type: 'SET_BLANK_INDICES', indices });
  }, []);

  return {
    state,
    actions: {
      handleWordClick,
      handleWordRemove,
      handleCorrect,
      toggleLanguage,
      reset,
      resetWords,
      startSaving,
      handleSaveError,
      handleSaveSuccess,
      revealHint,
      incrementError,
      setSelectedWords,
      setBlankIndices,
    },
  };
} 
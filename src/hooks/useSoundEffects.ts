import { useRef, useCallback } from 'react';

export function useSoundEffects() {
  const correctSound = useRef(new Audio('https://qeqjfuppdumygnwtruyr.supabase.co/storage/v1/object/public/sounds//good%20answer.mp3'));
  const incorrectSound = useRef(new Audio('https://qeqjfuppdumygnwtruyr.supabase.co/storage/v1/object/public/sounds//bad%20answer.mp3'));

  const playCorrect = useCallback(() => {
    correctSound.current.currentTime = 0;
    correctSound.current.play();
  }, []);

  const playIncorrect = useCallback(() => {
    incorrectSound.current.currentTime = 0;
    incorrectSound.current.play();
  }, []);

  return {
    playCorrect,
    playIncorrect
  };
} 
// src/hooks/useConfetti.ts
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function useConfetti(duration = 200) {
  const timeoutRef = useRef<number>();

  function fire() {
    const end = Date.now() + duration;
    const colors = ["#89e219", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        timeoutRef.current = requestAnimationFrame(frame);
      }
    })();
  }

  // cleanup on unmount
  useEffect(() => () => {
    if (timeoutRef.current) cancelAnimationFrame(timeoutRef.current);
    confetti.reset?.();
  }, []);

  return fire;
}
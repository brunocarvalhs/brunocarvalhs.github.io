import { useEffect, useState } from 'react';

/**
 * Types `text` out one character at a time, `speed`ms apart. Respects
 * `prefers-reduced-motion` (renders the full text immediately) and starts
 * once `startDelay`ms after mount — used to stage the effect after other
 * entrance animations.
 */
export function useTypewriter(text: string, speed = 60, startDelay = 0) {
  const [output, setOutput] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setOutput(text);
      setDone(true);
      return;
    }

    let i = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const startId = window.setTimeout(() => {
      intervalId = setInterval(() => {
        i += 1;
        setOutput(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      window.clearTimeout(startId);
      clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { output, done };
}

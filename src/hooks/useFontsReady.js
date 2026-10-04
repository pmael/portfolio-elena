import { useEffect, useState } from 'react';

const FONTS = ['100px "TAN Moonlight"', '30px "A Day Without Sun"'];

/**
 * True once both portfolio fonts are loaded (or after `timeoutMs`, so a slow network never blocks the page).
 * The intro animation waits for it, so the title never flashes in a fallback font first.
 */
export default function useFontsReady(timeoutMs = 2500) {
  const [ready, setReady] = useState(() => typeof document === 'undefined' || !document.fonts);

  useEffect(() => {
    if (!document.fonts) return undefined;

    let active = true;
    const finish = () => active && setReady(true);
    const timer = setTimeout(finish, timeoutMs);
    Promise.all(FONTS.map((font) => document.fonts.load(font))).then(finish, finish);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [timeoutMs]);

  return ready;
}

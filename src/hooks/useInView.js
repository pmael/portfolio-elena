import { useEffect, useRef, useState } from 'react';

/**
 * Watches an element against the viewport.
 *   seen    – flips to true the first time it is visible and stays true (entry animations)
 *   visible – live value (lets us pause endless animations while the element is off-screen)
 */
export default function useInView({ threshold = 0.25, rootMargin = '0px' } = {}) {
  const ref = useRef(null);
  const [state, setState] = useState({ seen: false, visible: false });

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setState({ seen: true, visible: true });
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setState((previous) => {
          const seen = previous.seen || entry.isIntersecting;
          return seen === previous.seen && entry.isIntersecting === previous.visible
            ? previous
            : { seen, visible: entry.isIntersecting };
        });
      },
      { threshold, rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, state];
}

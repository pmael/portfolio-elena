// Reads the OS "reduce motion" setting. The CSS already honours it; this is for the few places where JS decides
// (smooth scrolling, delayed unmounts).
export default function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const NavigationContext = createContext({ current: null, go: () => {}, next: () => {}, back: () => {} });

export const useNavigation = () => useContext(NavigationContext);

// The page the address asks for (#podcast), or the first one.
const pageFromAddress = (ids) => {
  const id = window.location.hash.slice(1);
  return ids.includes(id) ? id : ids[0];
};

/**
 * Which page is on screen. The portfolio is a set of pages shown one at a time (no scrolling between them):
 * `current` is the visible one, `previous` the one that is still fading out, `direction` tells which way the
 * transition goes. The address (#podcast) follows, so the browser's back button and shared links work.
 */
export function NavigationProvider({ ids, children }) {
  const [state, setState] = useState(() => ({ current: pageFromAddress(ids), previous: null, direction: 1 }));
  // Always the page being shown, even between a click and the next render.
  const currentRef = useRef(state.current);

  const show = useCallback(
    (id) => {
      const from = currentRef.current;
      if (id === from || !ids.includes(id)) return false;
      currentRef.current = id;
      setState({ current: id, previous: from, direction: ids.indexOf(id) > ids.indexOf(from) ? 1 : -1 });
      return true;
    },
    [ids]
  );

  const go = useCallback(
    (id) => {
      if (show(id)) window.history.pushState(null, '', `#${id}`);
    },
    [show]
  );

  const step = useCallback(
    (offset) => {
      const target = ids[ids.indexOf(currentRef.current) + offset];
      if (target) go(target);
    },
    [ids, go]
  );

  const next = useCallback(() => step(1), [step]);
  const back = useCallback(() => step(-1), [step]);

  // Called by the page host once the outgoing page has faded away.
  const settle = useCallback(() => setState((s) => (s.previous ? { ...s, previous: null } : s)), []);

  // Back / forward buttons.
  useEffect(() => {
    const onPopState = () => show(pageFromAddress(ids));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [ids, show]);

  // ← / → and Page Up / Page Down turn the pages (unless a player or the menu is open).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (document.querySelector('.lightbox, .menu.is-open')) return;
      if (event.target.closest && event.target.closest('input, textarea, select, video, iframe')) return;

      if (event.key === 'ArrowRight' || event.key === 'PageDown') next();
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') back();
      else return;
      event.preventDefault();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [next, back]);

  const value = useMemo(
    () => ({ ...state, ids, go, next, back, settle }),
    [state, ids, go, next, back, settle]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

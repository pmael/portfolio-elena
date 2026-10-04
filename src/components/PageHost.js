import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigation } from './Navigation';
import prefersReducedMotion from '../lib/motion';
import cx from '../lib/cx';
import './PageHost.css';

const LEAVE_MS = 550;

// A page is never scrolled: when its content is taller than the screen it is scaled down to fit. Only if that
// would make it unreadably small does it fall back to scrolling inside the page.
const SMALLEST_SCALE = 0.66;

function Page({ role, direction, first, children }) {
  const scrollerRef = useRef(null);
  const innerRef = useRef(null);
  const [fit, setFit] = useState({ scale: 1, scrolls: false });
  const [skipEntrance] = useState(first); // decided once, when the page appears

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    const inner = innerRef.current;

    const measure = () => {
      const available = scroller.clientHeight;
      const natural = inner.offsetHeight; // layout height: unaffected by the scale below
      const scale = natural > available + 1 ? Math.max(SMALLEST_SCALE, available / natural) : 1;
      setFit({ scale, scrolls: natural * scale > available + 1 });
    };
    measure();

    window.addEventListener('resize', measure);
    let observer = null;
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(measure); // content changes: fonts arriving, images…
      observer.observe(inner);
    }
    return () => {
      window.removeEventListener('resize', measure);
      if (observer) observer.disconnect();
    };
  }, []);

  const leaving = role === 'leaving';

  return (
    <div
      className={cx('page', `page--${role}`, skipEntrance && 'page--first')}
      style={{ '--direction': direction }}
      aria-hidden={leaving ? 'true' : undefined}
      inert={leaving}
    >
      <div ref={scrollerRef} className={cx('page__scroller', fit.scrolls && 'page__scroller--scrolls')}>
        <div
          ref={innerRef}
          className="page__inner"
          style={fit.scale < 1 ? { transform: `scale(${fit.scale})` } : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** Shows the current page (and, for a moment, the one it replaces), keeping focus where a reader expects it. */
export default function PageHost({ pages }) {
  const { current, previous, direction, settle } = useNavigation();
  const firstRender = useRef(true);
  const pageRef = useRef(null);

  // The very first page appears without the transition (the hero has its own intro).
  const [intro, setIntro] = useState(true);
  useEffect(() => {
    if (previous) setIntro(false);
  }, [previous]);

  // The outgoing page stays long enough to fade away.
  useEffect(() => {
    if (!previous) return undefined;
    const timer = setTimeout(settle, prefersReducedMotion() ? 0 : LEAVE_MS);
    return () => clearTimeout(timer);
  }, [previous, settle]);

  // After a change of page, keyboard and screen-reader users start at its top.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (pageRef.current) pageRef.current.focus({ preventScroll: true });
  }, [current]);

  const element = (id) => pages.find((page) => page.id === id).element;

  return (
    <main className="pages" ref={pageRef} tabIndex={-1}>
      {previous ? (
        <Page key={previous} role="leaving" direction={direction}>
          {element(previous)}
        </Page>
      ) : null}
      <Page key={current} role="current" direction={direction} first={intro && !previous}>
        {element(current)}
      </Page>
    </main>
  );
}

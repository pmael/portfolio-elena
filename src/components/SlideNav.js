import { useEffect, useState } from 'react';
import cx from '../lib/cx';
import './SlideNav.css';

// Dots on the right edge showing which slide is on screen; clicking one scrolls to it.
export default function SlideNav({ slides }) {
  const [active, setActive] = useState(slides[0].id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const sections = slides.map(({ id }) => document.getElementById(id)).filter(Boolean);
    // A zero-height band across the middle of the screen: a slide is "current" while it crosses that line.
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id)),
      { rootMargin: '-50% 0px -50% 0px' }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [slides]);

  return (
    <nav className="slide-nav" aria-label="Diapositivas">
      <ol>
        {slides.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={cx('slide-nav__dot', active === id && 'is-active')}
              aria-label={label}
              aria-current={active === id ? 'true' : undefined}
            >
              <span className="slide-nav__label" aria-hidden="true">
                {label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

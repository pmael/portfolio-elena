import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigation } from './Navigation';
import cx from '../lib/cx';
import './SiteMenu.css';

// Makes the glass catch the light where the pointer is (read by the highlight in SiteMenu.css).
function followPointer(event) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--mx', `${event.clientX - box.left}px`);
  event.currentTarget.style.setProperty('--my', `${event.clientY - box.top}px`);
}

/**
 * The hamburger on the top right and the liquid-glass panel that unfolds from it, listing every page.
 * `pages` is [{ id, label }] in order.
 */
export default function SiteMenu({ pages }) {
  const { current, go } = useNavigation();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus && buttonRef.current) buttonRef.current.focus({ preventScroll: true });
  }, []);

  // Escape closes; a click anywhere outside the menu closes too.
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
    };
    const onPointerDown = (event) => {
      if (!event.target.closest('.menu')) close(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    // Start on the current page, so the arrow of the keyboard user is where they are.
    const active = panelRef.current && panelRef.current.querySelector('[aria-current="page"]');
    if (active) active.focus({ preventScroll: true });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  const choose = (event, id) => {
    event.preventDefault();
    go(id);
    close(false);
  };

  return (
    <div className={cx('menu', open && 'is-open')}>
      <button
        ref={buttonRef}
        type="button"
        className="menu__button glass"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Cerrar el menú' : 'Abrir el menú'}
        onClick={() => setOpen((value) => !value)}
        onPointerMove={followPointer}
      >
        <span className="menu__bars" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      <nav
        id="site-menu"
        ref={panelRef}
        className="menu__panel glass"
        aria-label="Páginas"
        inert={!open}
        onPointerMove={followPointer}
      >
        <ol>
          {pages.map(({ id, label }, index) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cx('menu__item', id === current && 'is-active')}
                style={{ '--i': index }}
                aria-current={id === current ? 'page' : undefined}
                onClick={(event) => choose(event, id)}
              >
                <span className="menu__number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

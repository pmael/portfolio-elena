import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { embedUrl } from '../lib/media';
import prefersReducedMotion from '../lib/motion';
import cx from '../lib/cx';
import './VideoPlayer.css';

const CLOSE_ANIMATION_MS = 220;
const INSTAGRAM_ORIGIN = 'https://www.instagram.com';

const VideoPlayerContext = createContext({ open: () => {} });

export const useVideoPlayer = () => useContext(VideoPlayerContext);

const FOCUSABLE = 'button:not([disabled]), a[href], iframe';

// Keeps Tab inside the open dialog.
function trapFocus(event, container) {
  if (!container) return;
  const items = Array.from(container.querySelectorAll(FOCUSABLE));
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;

  if (!container.contains(active)) {
    event.preventDefault();
    first.focus();
  } else if (event.shiftKey && active === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

function Lightbox({ video, position, total, closing, onClose, onGo }) {
  const { media, caption, url } = video;
  const isInstagram = media.provider === 'instagram';
  const hasPrevious = position > 0;
  const hasNext = position < total - 1;

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [instagramHeight, setInstagramHeight] = useState(null);

  // The page behind stops scrolling while the player is open (without the layout jumping).
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--scrollbar-gap', `${window.innerWidth - root.clientWidth}px`);
    root.classList.add('is-locked');
    return () => {
      root.classList.remove('is-locked');
      root.style.removeProperty('--scrollbar-gap');
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft' && hasPrevious) {
        onGo(position - 1);
      } else if (event.key === 'ArrowRight' && hasNext) {
        onGo(position + 1);
      } else if (event.key === 'Tab') {
        trapFocus(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, onGo, position, hasPrevious, hasNext]);

  // Instagram's embed tells its parent how tall its content is, so the frame can fit it exactly.
  useEffect(() => {
    setInstagramHeight(null);
    if (!isInstagram) return undefined;

    const onMessage = (event) => {
      if (event.origin !== INSTAGRAM_ORIGIN) return;
      let data = event.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch {
          return;
        }
      }
      const height = data && data.type === 'MEASURE' ? Number(data.details && data.details.height) : 0;
      if (height > 0) setInstagramHeight(Math.ceil(height));
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [isInstagram, video.n]);

  const label = caption.replace(/\s*\n\s*/g, ' ');
  const provider = isInstagram ? 'Instagram' : 'YouTube';

  return (
    <div
      ref={dialogRef}
      className={cx('lightbox', closing && 'is-closing')}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div className="lightbox__backdrop" onClick={onClose} />

      <div className="lightbox__panel">
        <div
          className={cx('lightbox__stage', isInstagram ? 'lightbox__stage--portrait' : 'lightbox__stage--landscape')}
          style={instagramHeight ? { '--instagram-height': `${instagramHeight}px` } : undefined}
          key={video.n}
        >
          <iframe
            src={embedUrl(media)}
            title={label}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>

        <p className="lightbox__caption">{caption}</p>

        <div className="lightbox__controls">
          <button
            type="button"
            className="lightbox__step"
            onClick={() => onGo(position - 1)}
            disabled={!hasPrevious}
            aria-label="Vídeo anterior"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="lightbox__count" aria-live="polite">
            {position + 1} / {total}
          </span>
          <button
            type="button"
            className="lightbox__step"
            onClick={() => onGo(position + 1)}
            disabled={!hasNext}
            aria-label="Vídeo siguiente"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <a className="lightbox__source" href={url} target="_blank" rel="noopener noreferrer">
            Ver en {provider} ↗
          </a>
        </div>

        {isInstagram ? null : (
          <p className="lightbox__hint">Se reproduce sin sonido: activa el audio desde el reproductor.</p>
        )}

        <button
          type="button"
          ref={closeRef}
          className="lightbox__close"
          onClick={onClose}
          aria-label="Cerrar el vídeo"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Owns the video player of the whole page. Any card calls `useVideoPlayer().open(n)` to watch video n in a
 * lightbox, like stepping into a slide of a presentation; `videos` is the ordered list that previous / next walk through.
 */
export function VideoPlayerProvider({ videos, children }) {
  const [current, setCurrent] = useState({ n: null, closing: false });
  const opener = useRef(null);

  const open = useCallback((n) => {
    opener.current = document.activeElement;
    setCurrent({ n, closing: false });
  }, []);

  const close = useCallback(() => {
    setCurrent((state) => (state.n === null ? state : { ...state, closing: true }));
  }, []);

  const go = useCallback(
    (index) => {
      if (videos[index]) setCurrent({ n: videos[index].n, closing: false });
    },
    [videos]
  );

  // Let the closing animation play, then unmount (which also stops the video) and give focus back.
  useEffect(() => {
    if (!current.closing) return undefined;

    const finish = () => {
      setCurrent({ n: null, closing: false });
      if (opener.current && typeof opener.current.focus === 'function') {
        opener.current.focus({ preventScroll: true });
      }
    };
    if (prefersReducedMotion()) {
      finish();
      return undefined;
    }
    const timer = setTimeout(finish, CLOSE_ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [current.closing]);

  const position = videos.findIndex((video) => video.n === current.n);
  const api = useMemo(() => ({ open }), [open]);

  return (
    <VideoPlayerContext.Provider value={api}>
      {children}
      {position >= 0
        ? createPortal(
            <Lightbox
              video={videos[position]}
              position={position}
              total={videos.length}
              closing={current.closing}
              onClose={close}
              onGo={go}
            />,
            document.body
          )
        : null}
    </VideoPlayerContext.Provider>
  );
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { embedUrl } from '../lib/media';
import PdfReader from './PdfReader';
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
  const { media, caption, href, poster } = video;
  const isInstagram = media.provider === 'instagram';
  const isDocument = media.provider === 'pdf';
  const isFile = media.provider === 'file';
  const hasPrevious = position > 0;
  const hasNext = position < total - 1;

  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [instagramHeight, setInstagramHeight] = useState(null);

  // Reader state (documents only): current page and page count.
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    setPage(1);
    setPageCount(0);
  }, [video.n]);

  const flip = useCallback(
    (step) => setPage((current) => Math.min(Math.max(current + step, 1), pageCount || 1)),
    [pageCount],
  );

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      } else if (event.key === 'ArrowLeft') {
        if (isDocument) flip(-1);
        else if (hasPrevious) onGo(position - 1);
      } else if (event.key === 'ArrowRight') {
        if (isDocument) flip(1);
        else if (hasNext) onGo(position + 1);
      } else if (event.key === 'Tab') {
        trapFocus(event, dialogRef.current);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, onGo, flip, position, hasPrevious, hasNext, isDocument]);

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
        <div className="lightbox__viewer">
          <div
            className={cx(
              'lightbox__stage',
              isInstagram && 'lightbox__stage--portrait',
              isFile && 'lightbox__stage--video',
              isDocument && 'lightbox__stage--document',
              !isInstagram && !isFile && !isDocument && 'lightbox__stage--landscape',
            )}
            style={
              instagramHeight && isInstagram ? { '--instagram-height': `${instagramHeight}px` } : undefined
            }
            key={video.n}
          >
            {isDocument ? (
              <PdfReader src={media.src} title={label} page={page} onLoaded={setPageCount} onFlip={flip} />
            ) : isFile ? (
              <video
                src={media.src}
                poster={poster}
                title={label}
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <iframe
                src={embedUrl(media)}
                title={label}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            )}
          </div>

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

        <p className="lightbox__caption">{caption}</p>

        {isDocument ? (
          <div className="lightbox__controls lightbox__controls--pages">
            <button
              type="button"
              className="lightbox__step"
              onClick={() => flip(-1)}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <span className="lightbox__count lightbox__count--pages" aria-live="polite">
              Página {page} / {pageCount || '…'}
            </span>
            <button
              type="button"
              className="lightbox__step"
              onClick={() => flip(1)}
              disabled={!pageCount || page >= pageCount}
              aria-label="Página siguiente"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ) : null}

        <div className="lightbox__controls">
          <button
            type="button"
            className="lightbox__step"
            onClick={() => onGo(position - 1)}
            disabled={!hasPrevious}
            aria-label={isDocument ? 'Guion anterior' : 'Vídeo anterior'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="lightbox__count" aria-live="polite">
            {isDocument ? 'Guion ' : ''}
            {position + 1} / {total}
          </span>
          <button
            type="button"
            className="lightbox__step"
            onClick={() => onGo(position + 1)}
            disabled={!hasNext}
            aria-label={isDocument ? 'Guion siguiente' : 'Vídeo siguiente'}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {href ? (
            <a
              className="lightbox__source"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              download={isDocument ? '' : undefined}
            >
              {isDocument ? 'Descargar PDF ↓' : `Ver en ${provider} ↗`}
            </a>
          ) : null}
        </div>

        {isInstagram || isDocument ? null : (
          <p className="lightbox__hint">Se reproduce sin sonido: activa el audio desde el reproductor.</p>
        )}
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

  // Previous / next stay within the same kind: videos with videos, documents with documents.
  const opened = videos.find((video) => video.n === current.n);
  const sequence = useMemo(
    () =>
      opened
        ? videos.filter((video) => (video.media.provider === 'pdf') === (opened.media.provider === 'pdf'))
        : [],
    [videos, opened],
  );
  const position = opened ? sequence.indexOf(opened) : -1;

  const go = useCallback(
    (index) => {
      if (sequence[index]) setCurrent({ n: sequence[index].n, closing: false });
    },
    [sequence],
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

  const api = useMemo(() => ({ open }), [open]);

  return (
    <VideoPlayerContext.Provider value={api}>
      {children}
      {position >= 0
        ? createPortal(
            <Lightbox
              video={opened}
              position={position}
              total={sequence.length}
              closing={current.closing}
              onClose={close}
              onGo={go}
            />,
            document.body,
          )
        : null}
    </VideoPlayerContext.Provider>
  );
}

import { useEffect, useRef, useState } from 'react';
import cx from '../lib/cx';
import './PdfReader.css';

const SWIPE_DISTANCE = 60;

/**
 * Shows one page of a PDF at a time, fitted to the available space. The page number is owned by the player,
 * which draws the controls; this component only loads the document and paints the page.
 * pdf.js is loaded on demand, so visitors who never open a script never download it.
 */
export default function PdfReader({ src, title, page, onLoaded, onFlip }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const touchStart = useRef(null);

  const [doc, setDoc] = useState(null);
  const [failed, setFailed] = useState(false);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [paintedPage, setPaintedPage] = useState(0);

  // Load the document.
  useEffect(() => {
    let cancelled = false;
    let task = null;
    setDoc(null);
    setFailed(false);
    setPaintedPage(0);

    import('../lib/pdfjs')
      .then(({ default: pdfjs }) => {
        task = pdfjs.getDocument(src);
        return task.promise;
      })
      .then((loaded) => {
        if (cancelled) return;
        setDoc(loaded);
        onLoaded(loaded.numPages);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (task) task.destroy();
    };
  }, [src, onLoaded]);

  // Follow the size of the stage (window resize, rotation…).
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;

    const measure = () => setSize({ width: stage.clientWidth, height: stage.clientHeight });
    measure();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Paint the current page, sharp on high-density screens.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!doc || !canvas || !size.width || !size.height) return undefined;

    let cancelled = false;
    let rendering = null;

    doc
      .getPage(page)
      .then((pdfPage) => {
        if (cancelled) return null;

        const natural = pdfPage.getViewport({ scale: 1 });
        const fit = Math.min(size.width / natural.width, size.height / natural.height);
        const density = Math.min(window.devicePixelRatio || 1, 2.5);
        const viewport = pdfPage.getViewport({ scale: fit * density });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / density)}px`;
        canvas.style.height = `${Math.floor(viewport.height / density)}px`;

        rendering = pdfPage.render({ canvasContext: canvas.getContext('2d'), viewport });
        return rendering.promise;
      })
      .then(() => {
        if (!cancelled) setPaintedPage(page);
      })
      .catch((error) => {
        if (!cancelled && !(error && error.name === 'RenderingCancelledException')) setFailed(true);
      });

    return () => {
      cancelled = true;
      if (rendering) rendering.cancel();
    };
  }, [doc, page, size]);

  const onTouchStart = (event) => {
    touchStart.current = event.touches.length === 1 ? event.touches[0].clientX : null;
  };

  const onTouchEnd = (event) => {
    if (touchStart.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(distance) > SWIPE_DISTANCE) onFlip(distance < 0 ? 1 : -1);
  };

  return (
    <div
      ref={stageRef}
      className="pdf-reader"
      role="document"
      aria-label={title}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {failed ? (
        <p className="pdf-reader__message">No se ha podido abrir el documento. Prueba a descargarlo.</p>
      ) : (
        <>
          {doc ? null : <p className="pdf-reader__message">Cargando…</p>}
          <canvas
            key={page}
            ref={canvasRef}
            className={cx('pdf-reader__page', paintedPage === page && 'is-ready')}
          />
        </>
      )}
    </div>
  );
}

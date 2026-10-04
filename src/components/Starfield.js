import { useEffect, useMemo, useState } from 'react';
import { STARS, STAR_CANVAS } from '../data/stars';
import './Starfield.css';

// On phones the 1920px canvas would shrink the sparkles to a few pixels, so they never get smaller than half size.
const MIN_SCALE = 0.5;
const MAX_SCALE = 1.35;

// Tiny deterministic generator: every star keeps the same rhythm on each render and each reload.
function random(seed) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

// Each star breathes (opacity + size) and wanders a few pixels, both on very slow, out-of-phase loops.
function motionOf(seed) {
  const twinkle = 6 + random(seed) * 6;
  const drift = 40 + random(seed + 1) * 40;
  return {
    '--twinkle': `${twinkle.toFixed(2)}s`,
    '--twinkle-delay': `${(-random(seed + 2) * twinkle * 2).toFixed(2)}s`,
    '--drift': `${drift.toFixed(1)}s`,
    '--drift-delay': `${(-random(seed + 3) * drift * 2).toFixed(1)}s`,
    '--dx': `${((random(seed + 4) - 0.5) * 8).toFixed(1)}px`,
    '--dy': `${((random(seed + 5) - 0.5) * 8).toFixed(1)}px`,
    '--low': (0.14 + random(seed + 6) * 0.1).toFixed(2),
    '--high': (0.38 + random(seed + 7) * 0.12).toFixed(2),
  };
}

// The reference canvas is scaled to the viewport and repeated when the screen is taller or wider than it.
function buildField(width, height) {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, width / STAR_CANVAS.width));
  const tileWidth = STAR_CANVAS.width * scale;
  const tileHeight = STAR_CANVAS.height * scale;
  const columns = Math.ceil(width / tileWidth);
  const rows = Math.ceil(height / tileHeight);
  const field = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      STARS.forEach(([x, y, size], index) => {
        const diameter = size * scale;
        const left = column * tileWidth + x * scale - diameter / 2;
        const top = row * tileHeight + y * scale - diameter / 2;
        if (left > width || top > height || left + diameter < 0 || top + diameter < 0) return;

        const seed = (row * 31 + column * 17) * 100 + index + 1;
        field.push({
          key: `${row}-${column}-${index}`,
          style: { left, top, width: diameter, height: diameter, ...motionOf(seed) },
        });
      });
    }
  }
  return field;
}

const readViewport = () => ({ width: window.innerWidth, height: window.innerHeight });

export default function Starfield() {
  const [viewport, setViewport] = useState(readViewport);

  useEffect(() => {
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Mobile browsers resize the viewport while scrolling (collapsing toolbars): only ever grow the
        // height unless the width changes (rotation), so the stars never jump around.
        setViewport((previous) =>
          window.innerWidth === previous.width
            ? { ...previous, height: Math.max(previous.height, window.innerHeight) }
            : readViewport()
        );
      }, 120);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const field = useMemo(() => buildField(viewport.width, viewport.height), [viewport]);

  return (
    <div className="starfield" aria-hidden="true">
      {field.map(({ key, style }) => (
        <i key={key} className="star" style={style} />
      ))}
    </div>
  );
}

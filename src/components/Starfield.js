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

// Each star breathes (opacity + size), wanders along its own looping path, and now and then glints, all on slow,
// out-of-phase loops so the sky never pulses in unison.
function motionOf(seed) {
  const twinkle = 5 + random(seed) * 5;
  const drift = 18 + random(seed + 1) * 16;
  const shine = 8 + random(seed + 8) * 10;
  const reach = 8 + random(seed + 9) * 9;
  const around = (offset) => `${((random(seed + offset) - 0.5) * 2 * reach).toFixed(1)}px`;
  return {
    '--twinkle': `${twinkle.toFixed(2)}s`,
    '--twinkle-delay': `${(-random(seed + 2) * twinkle * 2).toFixed(2)}s`,
    '--drift': `${drift.toFixed(1)}s`,
    '--drift-delay': `${(-random(seed + 3) * drift).toFixed(1)}s`,
    '--x1': around(4),
    '--y1': around(5),
    '--x2': around(10),
    '--y2': around(11),
    '--turn': `${((random(seed + 12) - 0.5) * 24).toFixed(1)}deg`,
    '--shine': `${shine.toFixed(1)}s`,
    '--shine-delay': `${(-random(seed + 13) * shine).toFixed(1)}s`,
    '--low': (0.12 + random(seed + 6) * 0.08).toFixed(2),
    '--high': (0.4 + random(seed + 7) * 0.18).toFixed(2),
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
        <span key={key} className="star" style={style}>
          <i className="star__core" />
        </span>
      ))}
    </div>
  );
}

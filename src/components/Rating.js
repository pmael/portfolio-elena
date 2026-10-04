import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView';
import cx from '../lib/cx';
import { MAX_RATING } from '../data/software';
import starEmpty from '../assets/stars/star-empty.svg';
import starFull from '../assets/stars/star-full.svg';
import './Rating.css';

// Hovering replays the animation, but not while it is still running.
const REPLAY_AFTER_MS = 1600;

/**
 * Star rating that "pops" like a review on Airbnb: the outlined stars wait on the page, then the filled ones
 * spring in one after another (overshoot + soft golden burst) the first time the rating scrolls into view.
 */
export default function Rating({ value, max = MAX_RATING, label }) {
  const [ref, { seen }] = useInView({ threshold: 0.6 });
  const [replays, setReplays] = useState(0);
  const lastPlayed = useRef(0);

  // The first play starts as soon as the rating is seen.
  useEffect(() => {
    if (seen) lastPlayed.current = Date.now();
  }, [seen]);

  const replay = () => {
    const now = Date.now();
    if (!seen || now - lastPlayed.current < REPLAY_AFTER_MS) return;
    lastPlayed.current = now;
    setReplays((count) => count + 1);
  };

  return (
    <div
      ref={ref}
      className={cx('rating', seen && 'is-in', replays > 0 && 'is-replay')}
      role="img"
      aria-label={label || `${value} de ${max} estrellas`}
      onMouseEnter={replay}
    >
      {Array.from({ length: max }, (_, index) => {
        const filled = index < value;
        return (
          <span
            className={cx('rating__star', filled && 'rating__star--filled')}
            style={{ '--i': index }}
            key={index}
          >
            <img className="rating__empty" src={starEmpty} alt="" draggable="false" />
            {filled ? (
              // A new key restarts the CSS animation when replaying.
              <img
                className="rating__full"
                src={starFull}
                alt=""
                draggable="false"
                key={`full-${replays}`}
              />
            ) : null}
          </span>
        );
      })}
    </div>
  );
}

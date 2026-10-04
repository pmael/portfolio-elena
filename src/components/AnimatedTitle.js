import { Fragment } from 'react';
import useInView from '../hooks/useInView';
import cx from '../lib/cx';
import './AnimatedTitle.css';

/**
 * A heading whose letters fade in one after another (blur → sharp, rising slightly), then keep floating in a
 * very light wave while on screen.
 *
 *   lines     – one string per line: ['PORTFOLIO', 'AUDIOVISUAL']
 *   aside     – small italic note next to the title, e.g. "(En inglés)"
 *   ready     – hold the animation back until this is true (the hero waits for the fonts)
 *   startDelay – ms before the first letter appears
 */
export default function AnimatedTitle({
  as: Tag = 'h2',
  lines,
  aside,
  id,
  className,
  ready = true,
  startDelay = 0,
}) {
  const [ref, { seen, visible }] = useInView({ threshold: 0.5 });
  let letterIndex = 0;

  return (
    <Tag
      ref={ref}
      id={id}
      className={cx('title', className, ready && seen && 'is-in', visible && 'is-live')}
      style={{ '--title-delay': `${startDelay}ms` }}
      aria-label={[...lines, aside].filter(Boolean).join(' ')}
    >
      {lines.map((line, lineIndex) => (
        <span className="title__line" aria-hidden="true" key={line}>
          {line.split(' ').map((word, wordIndex, words) => (
            <Fragment key={`${word}-${wordIndex}`}>
              <span className="title__word">
                {Array.from(word.normalize('NFC')).map((letter, index) => (
                  <span className="title__char" style={{ '--i': letterIndex++ }} key={index}>
                    {letter}
                  </span>
                ))}
              </span>
              {wordIndex < words.length - 1 ? ' ' : null}
            </Fragment>
          ))}
          {aside && lineIndex === lines.length - 1 ? (
            <span className="title__aside">{aside}</span>
          ) : null}
        </span>
      ))}
    </Tag>
  );
}

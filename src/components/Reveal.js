import useInView from '../hooks/useInView';
import cx from '../lib/cx';

/**
 * Fades its content up into place the first time it scrolls into view (see `.reveal` in index.css).
 * `delay` staggers siblings; `enabled={false}` holds the reveal back (the hero waits for the fonts).
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  enabled = true,
  threshold = 0.15,
  className,
  style,
  children,
  ...rest
}) {
  const [ref, { seen }] = useInView({ threshold });

  return (
    <Tag
      ref={ref}
      className={cx('reveal', enabled && seen && 'is-visible', className)}
      style={{ '--reveal-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

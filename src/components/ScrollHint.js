import cx from '../lib/cx';
import './ScrollHint.css';

// The "swipe up" cue of a phone lock screen: a double chevron that fades in once the intro is over and takes
// you to the next page.
export default function ScrollHint({ href, label, onClick, enabled = true, delay = 0 }) {
  return (
    <a
      className={cx('scroll-hint', enabled && 'is-visible')}
      href={href}
      aria-label={label}
      onClick={onClick}
      style={{ '--hint-delay': `${delay}ms` }}
    >
      <svg viewBox="0 0 40 52" width="40" height="52" fill="none" aria-hidden="true">
        <path className="scroll-hint__chevron" d="M6 10l14 14 14-14" />
        <path className="scroll-hint__chevron scroll-hint__chevron--second" d="M6 26l14 14 14-14" />
      </svg>
    </a>
  );
}

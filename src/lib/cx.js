// Joins class names, skipping anything falsy: cx('a', cond && 'b') -> 'a b' | 'a'
export default function cx(...parts) {
  return parts.filter(Boolean).join(' ');
}

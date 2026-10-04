import cx from '../lib/cx';

// One "slide" of the presentation: a full-height section that holds a title and its content.
export default function Slide({ id, className, children }) {
  return (
    <section id={id} className={cx('slide', className)} aria-labelledby={`${id}-title`}>
      {children}
    </section>
  );
}

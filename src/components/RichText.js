/**
 * Renders a string where **double asterisks** mark the highlighted words. Highlights get an index (--k) so they
 * can light up one after another (see `.prose strong` in slides.css).
 */
export default function RichText({ text }) {
  let highlight = 0;
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? (
      <strong key={index} style={{ '--k': highlight++ }}>
        {part}
      </strong>
    ) : (
      part
    )
  );
}

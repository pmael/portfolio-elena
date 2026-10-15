/**
 * Renders a string with two light marks: **double asterisks** for the highlighted words (bold, #FFF3BD) and
 * *single asterisks* for italics. Highlights get an index (--k) so they can light up one after another
 * (see `.prose strong` in slides.css).
 */
export default function RichText({ text }) {
  let highlight = 0;
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/)
    .map((part, index) => {
      if (part.startsWith('**')) {
        return (
          <strong key={index} style={{ '--k': highlight++ }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*')) return <em key={index}>{part.slice(1, -1)}</em>;
      return part;
    });
}

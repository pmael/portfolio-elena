import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Rating from '../components/Rating';
import Reveal from '../components/Reveal';
import { MAX_RATING, SOFTWARE } from '../data/software';
import { SOFTWARE_TITLE } from '../data/content';

const COLUMNS = 2;

export default function Software() {
  const rows = Math.ceil(SOFTWARE.length / COLUMNS);

  return (
    <Slide id="softwares">
      <AnimatedTitle id="softwares-title" lines={SOFTWARE_TITLE} />
      <div className="slide__body">
        <ul className="software-grid">
          {SOFTWARE.map((tool, index) => {
            // The list reads down the left column, then down the right one; --order is the visual
            // (row by row) position, used to cascade the star animations across the grid.
            const column = Math.floor(index / rows);
            const row = index % rows;
            const order = row * COLUMNS + column;

            return (
              <Reveal
                as="li"
                className="software"
                delay={order * 90}
                style={{ '--order': order }}
                key={tool.id}
              >
                <img
                  className="software__logo"
                  src={tool.logo}
                  alt={`Logo de ${tool.name}`}
                  loading="lazy"
                  decoding="async"
                />
                <Rating
                  value={tool.rating}
                  label={`${tool.name}: ${tool.rating} de ${MAX_RATING} estrellas`}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </Slide>
  );
}

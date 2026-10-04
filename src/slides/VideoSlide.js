import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import VideoCard from '../components/VideoCard';

// Used for the four video slides (Vídeos, Videoclips musicales, Redes sociales, Guiones): only the content of
// `slide` (see data/videos.js) changes. The card shape comes from `orientation`; how many sit on a row from the
// item count (see `.video-grid` in slides.css).
export default function VideoSlide({ slide }) {
  const { id, title, aside, orientation, items } = slide;

  return (
    <Slide id={id} className={`slide--videos slide--${orientation}`}>
      <AnimatedTitle id={`${id}-title`} lines={title} aside={aside} />
      <div className="slide__body">
        <div className={`video-grid video-grid--${orientation}`} data-count={items.length}>
          {items.map((item, index) => (
            <Reveal as="figure" className="video-item" delay={index * 130} key={item.n}>
              <VideoCard item={item} />
              <figcaption>{item.caption}</figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </Slide>
  );
}

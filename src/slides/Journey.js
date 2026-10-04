import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import RichText from '../components/RichText';
import { JOURNEY } from '../data/content';

export default function Journey() {
  return (
    <Slide id="trayectoria">
      <AnimatedTitle id="trayectoria-title" lines={JOURNEY.title} />
      <div className="slide__body prose prose--highlights">
        <div className="prose__block">
          <Reveal as="p" threshold={0.08}>
            <RichText text={JOURNEY.paragraph} />
          </Reveal>
          <Reveal as="p" delay={250}>
            {JOURNEY.closing}
          </Reveal>
        </div>
      </div>
    </Slide>
  );
}

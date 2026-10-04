import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import ScrollHint from '../components/ScrollHint';
import useFontsReady from '../hooks/useFontsReady';
import { HERO } from '../data/content';

// The intro, in the spirit of a phone's welcome screen: the title appears letter by letter, then the name,
// then a "keep going" cue. Times are in ms from the moment the fonts are ready.
const TITLE_START = 400;
const NAME_DELAY = 2500;
const HINT_DELAY = 4200;

export default function Hero() {
  const fontsReady = useFontsReady();

  return (
    <Slide id="inicio" className="slide--hero">
      <AnimatedTitle
        as="h1"
        id="inicio-title"
        className="title--hero"
        lines={HERO.title}
        ready={fontsReady}
        startDelay={TITLE_START}
      />
      <Reveal as="p" className="hero__name" delay={NAME_DELAY} enabled={fontsReady}>
        {HERO.name}
      </Reveal>
      <ScrollHint
        href="#quien-soy"
        label="Ir a la siguiente diapositiva"
        enabled={fontsReady}
        delay={HINT_DELAY}
      />
    </Slide>
  );
}

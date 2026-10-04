import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import { ABOUT } from '../data/content';

export default function About() {
  return (
    <Slide id="quien-soy">
      <AnimatedTitle id="quien-soy-title" lines={ABOUT.title} />
      <div className="slide__body prose">
        {ABOUT.blocks.map((block, blockIndex) => (
          <div className="prose__block" key={blockIndex}>
            {block.map((text, lineIndex) => (
              <Reveal as="p" delay={Math.min(blockIndex * 90 + lineIndex * 120, 480)} key={text}>
                {text}
              </Reveal>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

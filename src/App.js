import Starfield from './components/Starfield';
import SlideNav from './components/SlideNav';
import { VideoPlayerProvider } from './components/VideoPlayer';
import Hero from './slides/Hero';
import About from './slides/About';
import Journey from './slides/Journey';
import Software from './slides/Software';
import Podcast from './slides/Podcast';
import VideoSlide from './slides/VideoSlide';
import Contact from './slides/Contact';
import { SLIDE_NAV } from './data/content';
import { PLAYABLE_VIDEOS, VIDEO_SLIDES } from './data/videos';
import './slides/slides.css';

export default function App() {
  return (
    <VideoPlayerProvider videos={PLAYABLE_VIDEOS}>
      <Starfield />
      <main>
        <Hero />
        <About />
        <Journey />
        <Software />
        <Podcast />
        {VIDEO_SLIDES.map((slide) => (
          <VideoSlide slide={slide} key={slide.id} />
        ))}
        <Contact />
      </main>
      {/* Fixed to the right edge, so it can come last in the DOM: keyboard users reach the content first. */}
      <SlideNav slides={SLIDE_NAV} />
    </VideoPlayerProvider>
  );
}

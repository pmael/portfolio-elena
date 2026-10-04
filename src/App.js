import Starfield from './components/Starfield';
import SiteMenu from './components/SiteMenu';
import PageHost from './components/PageHost';
import { NavigationProvider } from './components/Navigation';
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

// What each page shows. The order and names of the pages come from SLIDE_NAV (data/content.js).
const CONTENT = {
  inicio: <Hero />,
  'quien-soy': <About />,
  trayectoria: <Journey />,
  softwares: <Software />,
  podcast: <Podcast />,
  contacto: <Contact />,
  ...Object.fromEntries(VIDEO_SLIDES.map((slide) => [slide.id, <VideoSlide slide={slide} />])),
};

const PAGES = SLIDE_NAV.map(({ id, label }) => ({ id, label, element: CONTENT[id] }));
const PAGE_IDS = PAGES.map((page) => page.id);

// The portfolio is a set of pages shown one at a time: the hamburger (top right) opens the list of them.
export default function App() {
  return (
    <NavigationProvider ids={PAGE_IDS}>
      <VideoPlayerProvider videos={PLAYABLE_VIDEOS}>
        <Starfield />
        <PageHost pages={PAGES} />
        <SiteMenu pages={PAGES} />
      </VideoPlayerProvider>
    </NavigationProvider>
  );
}

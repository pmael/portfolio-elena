import davinci from '../assets/logos/davinci-resolve.png';
import premiere from '../assets/logos/premiere-pro.png';
import capcut from '../assets/logos/capcut.png';
import afterEffects from '../assets/logos/after-effects.png';
import lightroom from '../assets/logos/lightroom.png';
import photoshop from '../assets/logos/photoshop.png';
import audacity from '../assets/logos/audacity.png';
import canva from '../assets/logos/canva.png';

export const MAX_RATING = 5;

// Order = reading order of the reference slide: the left column top to bottom, then the right column.
export const SOFTWARE = [
  { id: 'davinci-resolve', name: 'DaVinci Resolve', logo: davinci, rating: 3 },
  { id: 'premiere-pro', name: 'Adobe Premiere Pro', logo: premiere, rating: 3 },
  { id: 'capcut', name: 'CapCut', logo: capcut, rating: 4 },
  { id: 'after-effects', name: 'Adobe After Effects', logo: afterEffects, rating: 2 },
  { id: 'lightroom', name: 'Adobe Lightroom', logo: lightroom, rating: 3 },
  { id: 'photoshop', name: 'Adobe Photoshop', logo: photoshop, rating: 1 },
  { id: 'audacity', name: 'Audacity', logo: audacity, rating: 4 },
  { id: 'canva', name: 'Canva', logo: canva, rating: 4 },
];

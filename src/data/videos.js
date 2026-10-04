import { parseMediaUrl } from '../lib/media';
import reunionPoster from '../assets/posters/instagram-DSzbShhCG3X.jpg';
import newYorkPoster from '../assets/posters/instagram-DERoZsLR6jz.jpg';

/*
 * Every video slot of the portfolio, numbered like the reference slides (1 to 13).
 *
 *  - A slot with a `url` becomes a playable card. YouTube and Instagram reel links are understood
 *    (YouTube thumbnails are fetched automatically; for Instagram, which has no public thumbnails,
 *    give a `poster` image).
 *  - A slot without a `url` stays a blank placeholder, ready to be filled in later.
 */
const SLIDES = [
  {
    id: 'videos',
    label: 'Vídeos',
    title: ['Vídeos'],
    orientation: 'landscape',
    items: [
      {
        n: 1,
        url: 'https://youtu.be/EXBpnLsG9fc?is=DFdHPStw8igq1tFr',
        caption: 'Making of de videoclip. Cámara. Mayo 2026',
      },
      {
        n: 2,
        url: 'https://youtu.be/RmsB_YfIp6M?is=xoOTNTwpbv0QG55H',
        caption: 'Documental sobre cangrejos, San Francisco. Editora. Mayo 2025',
      },
      {
        n: 3,
        url: 'https://youtu.be/76VeTAbXUxI',
        caption: 'Corto mudo. Directora y editora. Marzo 2025',
      },
      {
        n: 4,
        url: 'https://youtu.be/E30ZGtSz7TQ',
        caption: 'Corto experimental. Directora y editora. Noviembre 2024',
      },
    ],
  },
  {
    id: 'videoclips',
    label: 'Videoclips musicales',
    title: ['Videoclips musicales'],
    orientation: 'landscape',
    items: [
      {
        n: 5,
        url: 'https://youtu.be/ikuM2jn-PIM',
        caption: 'Ayudante de producción. Mayo 2026',
      },
      {
        n: 6,
        url: 'https://youtu.be/j_IxsMAV9qM?is=MXs6ymK0XzPJQSgL',
        caption: 'Ayudante de dirección. Septiembre 2026',
      },
    ],
  },
  {
    id: 'redes-sociales',
    label: 'Redes sociales',
    title: ['Redes sociales'],
    orientation: 'portrait',
    items: [
      {
        n: 7,
        url: 'https://www.instagram.com/reel/DSzbShhCG3X/?stkn=MWRqbmpqN3czYnJ6MQ==',
        poster: reunionPoster,
        caption: 'Vlog viaje a La Réunion.\nCámara y editora. Diciembre 2025',
      },
      {
        n: 8,
        url: null,
        caption: 'Montaje skate, Venice Beach, Los Ángeles.\nCámara y editora. Enero 2025',
      },
      {
        n: 9,
        url: 'https://www.instagram.com/reel/DERoZsLR6jz/?stkn=MWZzbThicjY4c2NleQ==',
        poster: newYorkPoster,
        caption: 'Vlog viaje a Nueva York.\nCámara y editora. Diciembre 2024',
      },
      {
        n: 10,
        url: null,
        caption: 'Mock app campaign. Editora. Abril 2024',
      },
    ],
  },
  {
    id: 'guiones',
    label: 'Guiones',
    title: ['Guiones'],
    aside: '(En inglés)',
    orientation: 'portrait',
    items: [
      { n: 11, url: null, caption: 'Minirrelato. The Lady in Distress. Septiembre 2025' },
      { n: 12, url: null, caption: 'Minirrelato. Grief. Septiembre 2025' },
      { n: 13, url: null, caption: 'Largometraje. Stormed (escenas 1-8). Diciembre 2024' },
    ],
  },
];

export const VIDEO_SLIDES = SLIDES.map((slide) => ({
  ...slide,
  items: slide.items.map((item) => {
    const media = parseMediaUrl(item.url);
    return { ...item, media, playable: Boolean(media) };
  }),
}));

// Only the slots that can actually be played, in order (used by the previous / next buttons of the player).
export const PLAYABLE_VIDEOS = VIDEO_SLIDES.flatMap((slide) => slide.items).filter(
  (item) => item.playable
);

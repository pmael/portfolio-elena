import { parseMediaUrl } from '../lib/media';
import reunionPoster from '../assets/posters/instagram-DSzbShhCG3X.jpg';
import newYorkPoster from '../assets/posters/instagram-DERoZsLR6jz.jpg';
import video8 from '../assets/videos/video-8.mp4';
import video8Poster from '../assets/posters/video-8.jpg';
import video10 from '../assets/videos/video-10.mp4';
import video10Poster from '../assets/posters/video-10.jpg';
import document11 from '../assets/documents/document-11.pdf';
import document11Poster from '../assets/posters/document-11.jpg';
import document12 from '../assets/documents/document-12.pdf';
import document12Poster from '../assets/posters/document-12.jpg';
import document13 from '../assets/documents/document-13.pdf';
import document13Poster from '../assets/posters/document-13.jpg';

/*
 * Every video slot of the portfolio, numbered like the reference slides (1 to 13).
 *
 *  - A slot with a `url` becomes a playable card. YouTube and Instagram reel links are understood
 *    (YouTube thumbnails are fetched automatically; for Instagram, which has no public thumbnails,
 *    give a `poster` image).
 *  - A slot with a `file` is a video file (.mp4) or a PDF document that ships with the site: import it, and
 *    give a `poster` image (a video frame, or the first page of the PDF). PDFs open in a page reader.
 *  - A slot with neither stays a blank placeholder, ready to be filled in later.
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
        file: video8,
        poster: video8Poster,
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
        file: video10,
        poster: video10Poster,
        caption: 'Mock app campaign. Editora. Abril 2024',
      },
    ],
  },
  {
    id: 'guiones',
    label: 'Guiones',
    title: ['Guiones'],
    aside: '(En inglés)',
    orientation: 'document',
    items: [
      {
        n: 11,
        file: document11,
        poster: document11Poster,
        caption: 'Minirrelato. The Lady in Distress. Septiembre 2025',
      },
      { n: 12, file: document12, poster: document12Poster, caption: 'Minirrelato. Grief. Septiembre 2025' },
      {
        n: 13,
        file: document13,
        poster: document13Poster,
        caption: 'Largometraje. Stormed (escenas 1-8). Diciembre 2024',
      },
    ],
  },
];

// What a slot plays: a YouTube / Instagram link, a video file, or a PDF.
export function mediaOf(item) {
  if (item.file) {
    return /\.pdf(\?|$)/i.test(item.file)
      ? { provider: 'pdf', src: item.file }
      : { provider: 'file', src: item.file };
  }
  return parseMediaUrl(item.url);
}

export const VIDEO_SLIDES = SLIDES.map((slide) => ({
  ...slide,
  items: slide.items.map((item) => {
    const media = mediaOf(item);
    return {
      ...item,
      media,
      playable: Boolean(media),
      // Where "see the original" points: the link itself, or the PDF to download (a video file has none).
      href: item.url || (media && media.provider === 'pdf' ? media.src : null),
    };
  }),
}));

export const isDocument = (item) => Boolean(item.media) && item.media.provider === 'pdf';

// Every slot that can be opened, in order. The player's previous / next buttons walk through the videos or
// through the documents, never mixing the two.
export const PLAYABLE_VIDEOS = VIDEO_SLIDES.flatMap((slide) => slide.items).filter(
  (item) => item.playable
);

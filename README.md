# Elena Morales · Portfolio audiovisual

A one-page, animated portfolio that follows the slides of the original deck: intro, ¿Quién soy?, trayectoria,
software ratings, podcast, videos, music videos, social media, scripts and contact. Built with React
(Create React App), plain CSS and no animation library.

## Run it

```bash
npm install
npm start          # http://localhost:3000
npm test           # 60 tests: ratings, video mapping, links, player behaviour…
npm run build      # production build in build/
```

`package.json` sets `"homepage": "."`, so the build works from any address or sub-folder.

## Edit the content

Everything that can change lives in `src/data/`; no component needs to be touched.

| File | What it holds |
| --- | --- |
| `content.js` | All the texts. `**double asterisks**` make a word bold and highlighted (`#FFF3BD`). |
| `software.js` | The 8 tools, their logo and their rating (0 to 5). |
| `videos.js` | The 13 video slots, their captions and links. |
| `links.js` | Email, Instagram, LinkedIn, the podcast website. |

**Fill a blank video slot** (8, 10, 11, 12, 13): in `videos.js`, give it a `url`. YouTube and Instagram reel links
are understood. YouTube thumbnails are fetched automatically; for an Instagram reel also add a `poster` image
(Instagram has no public thumbnails; import one the way slots 7 and 9 do).

**Podcast website**: the underlined "página web" of the Podcast slide becomes a link as soon as you paste its
address in `PODCAST_WEBSITE` (`links.js`).

## How it behaves

- **Intro**: the title appears letter by letter (blur to sharp) once the fonts are loaded, then the name, then a
  "keep going" chevron, like a phone's welcome screen.
- **Titles** float in a very light wave while on screen. Slide content fades up as it scrolls into view; the
  highlighted words light up one after another.
- **Stars**: rebuilt from `stars-background.svg` (same 52 sparkles as the slides). They breathe and drift very
  slowly, forever, and are not rendered when the system asks for reduced motion.
- **Ratings**: the filled stars spring in one after another (like an Airbnb review) when they scroll into view;
  hovering a rating replays it.
- **Videos**: a card opens the video in a lightbox. YouTube starts **muted** (`mute=1`); use the speaker button of
  the player to hear it. Instagram's embed offers no such switch, so it loads its own player. ← / → or the
  buttons step through the videos, Esc closes. "Ver en YouTube / Instagram" opens the original.
- **Contact**: the two Elenas pivot left and right, in mirror. Instagram (logo and QR) and LinkedIn open in a new tab.
- The layout adapts from phones to large screens (it scales up above 1920px), and respects `prefers-reduced-motion`.

## Fonts and licences

- **Titles**: TAN Moonlight (`src/assets/fonts/tan-moonlight.woff2`), colour `#A5D7FF`. No licence file came with the
  font: check that its licence allows use on a website.
- **Text**: *A day without sun* by Zetafonts (`a-day-without-sun.otf`, used unmodified). It is released under
  **CC BY-NC**: its licence asks for a credit line (currently not shown on the page) and commercial use needs a licence from
  Zetafonts (<http://www.zetafonts.com/collection/188>). A portfolio used to find work may count as commercial use.

## Project layout

```
src/
  data/         content, ratings, videos, links, star positions
  slides/       one component per slide + slides.css
  components/   Starfield, AnimatedTitle, Rating, VideoCard, VideoPlayer (lightbox), SlideNav…
  hooks/        useInView, useFontsReady
  lib/          video-link parsing, small helpers
  assets/       fonts, logos, images, rating stars, Instagram posters
```

Logo files from the original folder: `portfolio 2` = DaVinci Resolve, `2-2` = Lightroom, `2-3` = Premiere Pro,
`2-4` = Photoshop, `2-5` = CapCut, `2-6` = Audacity, `2-7` = After Effects, `2-8` = Canva
(`2-10` and `link-insta` are the same Instagram QR code). The podcast cover is `startGif.gif`, converted to a lighter
animated WebP (same 180 frames and timing, 3.5 MB → 1 MB).

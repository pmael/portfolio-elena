# Elena Morales · Portfolio audiovisual

An animated portfolio that follows the slides of the original deck, shown one page at a time: intro, ¿Quién soy?, trayectoria,
software ratings, podcast, videos, music videos, social media, scripts and contact. Built with React
(Create React App), plain CSS and no animation library.

## Run it

```bash
npm install
npm start          # http://localhost:3000
npm test           # ratings, video mapping, links, player and script reader behaviour…
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

**Change what a slot opens** (in `videos.js`, each slot is one of these):
- `url`: a YouTube or Instagram reel link. YouTube thumbnails are fetched automatically; an Instagram reel also
  needs a `poster` image (Instagram has no public thumbnails).
- `file`: a video (`src/assets/videos/*.mp4`) or a PDF (`src/assets/documents/*.pdf`) that ships with the site, plus
  a `poster` image (a frame of the video, or the first page of the PDF).
- neither: a blank dashed card, ready to be filled later (currently every slot is filled).

Videos 8 and 10 were phone `.mov` files (10 MB and 40 MB); they were converted to H.264/AAC `.mp4` at 720p
(1.7 MB and 4.5 MB). To add another one the same way: `ffmpeg -i in.mov -vf "scale='min(720,iw)':-2" -c:v libx264
-crf 24 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k out.mp4`.

**Podcast website**: the underlined "página web" of the Podcast slide becomes a link as soon as you paste its
address in `PODCAST_WEBSITE` (`links.js`).

## How it behaves

- **Pages, no scrolling**: each slide of the deck is a page, shown on its own. The **hamburger** on the top right
  opens a liquid-glass menu listing every page (it grows out of the button; the light follows the pointer).
  ← / → (or Page Up / Down), the browser's back button and the arrow of the intro also turn pages, and the
  address follows (`#podcast`). A page taller than the screen is scaled down to fit (down to 66%; only below
  that does it scroll inside the page). Each page plays its entrance animations every time it opens.
- **Intro**: the title appears letter by letter (blur to sharp) once the fonts are loaded, then the name, then a
  "keep going" chevron (it opens the next page), like a phone's welcome screen.
- **Titles** float in a very light wave while on screen. Page content fades up; the highlighted words light up one
  after another.
- **Stars**: rebuilt from `stars-background.svg` (same 52 sparkles as the slides). Each one breathes, wanders along
  its own small looping path and, every 8 to 18 seconds, glints (a brighter star with a soft halo). They are
  static when the system asks for reduced motion.
- **Ratings**: the filled stars spring in one after another (like an Airbnb review) when the page opens;
  hovering a rating replays it.
- **Scripts (PDF)**: a card opens a page reader (pdf.js, loaded only when needed): ← / → or the buttons flip pages,
  swipe on a phone, "Descargar PDF" saves the file.
- **Videos**: a card opens the video in a lightbox, with the cross to the right of the reader. YouTube and the video
  files start **muted** (`mute=1`); use the speaker button of the player to hear it. Instagram's embed offers no
  such switch, so it loads its own player. ← / → or the buttons step through the videos, Esc closes.
  "Ver en YouTube / Instagram" opens the original.
- **Contact**: the two Elenas pivot left and right, in mirror. The Instagram logo and LinkedIn open in a new tab; the
  QR code is only a picture.
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
  components/   Starfield, AnimatedTitle, Rating, VideoCard, VideoPlayer (lightbox), SiteMenu (hamburger), PageHost…
  hooks/        useInView, useFontsReady
  lib/          video-link parsing, small helpers
  assets/       fonts, logos, images, rating stars, Instagram posters
```

Logo files from the original folder: `portfolio 2` = DaVinci Resolve, `2-2` = Lightroom, `2-3` = Premiere Pro,
`2-4` = Photoshop, `2-5` = CapCut, `2-6` = Audacity, `2-7` = After Effects, `2-8` = Canva
(`2-10` and `link-insta` are the same Instagram QR code). The podcast cover is `startGif.gif`, converted to a lighter
animated WebP (same 180 frames and timing, 3.5 MB → 1 MB).

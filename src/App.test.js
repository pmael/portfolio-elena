import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';

// The whole site, rendered once per test. The stand-ins in setupTests.js make every animation reach its final
// state at once and make page changes immediate (as for a visitor who asked for reduced motion).

const PAGES = [
  'Inicio',
  'Quién soy',
  'Mi trayectoria',
  'Softwares de edición',
  'Podcast',
  'Vídeos',
  'Videoclips musicales',
  'Redes sociales',
  'Guiones',
  'Contáctame',
];

beforeEach(() => window.history.replaceState(null, '', '/'));

const menuButton = () => screen.getByRole('button', { name: /el menú$/ });
const menu = () => within(screen.getByRole('navigation', { name: 'Páginas' }));

// Goes to a page the way a visitor does: hamburger, then the page in the list.
async function goTo(label) {
  fireEvent.click(menuButton());
  fireEvent.click(menu().getByRole('link', { name: label }));
  await waitFor(() => expect(document.querySelectorAll('.page')).toHaveLength(1));
}

describe('the pages', () => {
  test('the site opens on the intro, "PORTFOLIO AUDIOVISUAL", with the name underneath', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'PORTFOLIO AUDIOVISUAL' })).toBeInTheDocument();
    expect(screen.getByText('Elena Morales Jiménez')).toBeInTheDocument();
  });

  test('only one page is on screen: nothing scrolls between them', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('.page')).toHaveLength(1);
    expect(screen.queryByRole('heading', { name: '¿Quién Soy?' })).not.toBeInTheDocument();
  });

  test('the hamburger lists the ten pages of the deck, in order, and marks the current one', () => {
    render(<App />);
    const links = menu().getAllByRole('link');
    expect(links.map((link) => link.textContent.replace(/^\d+/, ''))).toEqual(PAGES);
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuButton());
    expect(menuButton()).toHaveAttribute('aria-expanded', 'true');
  });

  test.each([
    ['Quién soy', '¿Quién Soy?'],
    ['Mi trayectoria', 'Mi trayectoria'],
    ['Softwares de edición', 'Softwares de edición'],
    ['Podcast', 'Podcast'],
    ['Vídeos', 'Vídeos'],
    ['Videoclips musicales', 'Videoclips musicales'],
    ['Redes sociales', 'Redes sociales'],
    ['Guiones', 'Guiones (En inglés)'],
    ['Contáctame', '¡Contáctame!'],
  ])('"%s" in the menu opens the page titled "%s"', async (label, title) => {
    render(<App />);
    await goTo(label);
    expect(screen.getByRole('heading', { level: 2, name: title })).toBeInTheDocument();
    expect(menu().getByRole('link', { name: label })).toHaveAttribute('aria-current', 'page');
    expect(window.location.hash).not.toBe('');
  });

  test('the menu closes after choosing, and with Escape', async () => {
    render(<App />);
    await goTo('Podcast');
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(menuButton());
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menuButton()).toHaveAttribute('aria-expanded', 'false');
  });

  test('the arrow keys turn the pages, and the address follows', async () => {
    render(<App />);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    await waitFor(() => expect(screen.getByRole('heading', { name: '¿Quién Soy?' })).toBeInTheDocument());
    expect(window.location.hash).toBe('#quien-soy');

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument());
  });

  test('the arrow at the bottom of the intro goes to the next page', async () => {
    render(<App />);
    fireEvent.click(screen.getByRole('link', { name: 'Ir a la página siguiente' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: '¿Quién Soy?' })).toBeInTheDocument());
  });

  test('a link to a page (#podcast) opens that page', () => {
    window.history.replaceState(null, '', '/#podcast');
    render(<App />);
    expect(screen.getByRole('heading', { level: 2, name: 'Podcast' })).toBeInTheDocument();
  });
});

describe('highlighted words', () => {
  test('are bold and come from the text of the "Mi trayectoria" page', async () => {
    const { container } = render(<App />);
    await goTo('Mi trayectoria');
    const words = Array.from(container.querySelectorAll('strong')).map((node) => node.textContent);
    expect(words).toEqual([
      'redes sociales',
      'inglés',
      'Comunicación Audiovisual',
      'San Francisco',
      'radio',
      'ayudante de realización',
      'iluminación',
      'sonido',
      'cámara',
      'Teatro Azarte',
      'videoclips musicales',
      'edición',
    ]);
  });
});

describe('software ratings', () => {
  test.each([
    ['DaVinci Resolve', 3],
    ['Adobe Premiere Pro', 3],
    ['CapCut', 4],
    ['Adobe After Effects', 2],
    ['Adobe Lightroom', 3],
    ['Adobe Photoshop', 1],
    ['Audacity', 4],
    ['Canva', 4],
  ])('%s shows %i filled stars out of 5', async (name, filled) => {
    render(<App />);
    await goTo('Softwares de edición');
    const rating = screen.getByRole('img', { name: `${name}: ${filled} de 5 estrellas` });
    expect(rating.querySelectorAll('.rating__star')).toHaveLength(5);
    expect(rating.querySelectorAll('.rating__full')).toHaveLength(filled);
  });

  test('each tool shows its logo', async () => {
    render(<App />);
    await goTo('Softwares de edición');
    expect(screen.getAllByRole('img', { name: /^Logo de / })).toHaveLength(8);
  });
});

describe('contact page', () => {
  test('Instagram and LinkedIn open the right profiles in a new tab', async () => {
    render(<App />);
    await goTo('Contáctame');

    const linkedin = screen.getByRole('link', { name: /LinkedIn/ });
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/eleemj');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noopener'));

    const instagram = screen.getByRole('link', { name: /Instagram/ });
    expect(instagram).toHaveAttribute('href', 'https://www.instagram.com/eleemj?stkn=d2EydXljaHkzMnFw');
    expect(instagram).toHaveAttribute('target', '_blank');
  });

  test('the QR code is only a picture: not a link, and no "scan or click" line', async () => {
    render(<App />);
    await goTo('Contáctame');
    const qr = screen.getByRole('img', { name: /Código QR/ });
    expect(qr.closest('a')).toBeNull();
    expect(screen.queryByText(/Escanea/)).not.toBeInTheDocument();
  });

  test('the email is a mailto link', async () => {
    render(<App />);
    await goTo('Contáctame');
    expect(screen.getByRole('link', { name: /eleemjmnz@gmail.com/ })).toHaveAttribute(
      'href',
      'mailto:eleemjmnz@gmail.com'
    );
  });

  test('both Elenas are there, ready to pivot, and there is no font credit line', async () => {
    const { container } = render(<App />);
    await goTo('Contáctame');
    expect(container.querySelectorAll('.elena img')).toHaveLength(2);
    expect(screen.queryByText(/Zetafonts/)).not.toBeInTheDocument();
  });
});

describe('video player', () => {
  const playButtons = () => screen.getAllByRole('button', { name: /^Reproducir:/ });

  test('every video card opens a player; every script card opens a reader', async () => {
    render(<App />);
    let videos = 0;
    let scripts = 0;
    for (const page of ['Vídeos', 'Videoclips musicales', 'Redes sociales', 'Guiones']) {
      await goTo(page);
      videos += screen.queryAllByRole('button', { name: /^Reproducir:/ }).length;
      scripts += screen.queryAllByRole('button', { name: /^Leer:/ }).length;
    }
    expect([videos, scripts]).toEqual([10, 3]);
    expect(document.querySelectorAll('.video-card--blank')).toHaveLength(0);
  });

  test('clicking a video opens it muted, with autoplay, and Escape closes it', async () => {
    render(<App />);
    await goTo('Vídeos');

    fireEvent.click(playButtons()[0]);
    const dialog = screen.getByRole('dialog', { name: 'Making of de videoclip. Cámara. Mayo 2026' });
    const frame = within(dialog).getByTitle('Making of de videoclip. Cámara. Mayo 2026');
    const src = new URL(frame.getAttribute('src'));
    expect(src.pathname).toBe('/embed/EXBpnLsG9fc');
    expect(src.searchParams.get('mute')).toBe('1');
    expect(src.searchParams.get('autoplay')).toBe('1');
    expect(within(dialog).getByRole('link', { name: /Ver en YouTube/ })).toHaveAttribute(
      'href',
      'https://youtu.be/EXBpnLsG9fc?is=DFdHPStw8igq1tFr'
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  test('the cross sits to the right of the reader, next to it', async () => {
    render(<App />);
    await goTo('Vídeos');
    fireEvent.click(playButtons()[0]);

    const dialog = screen.getByRole('dialog');
    const viewer = dialog.querySelector('.lightbox__viewer');
    expect(viewer.querySelector('.lightbox__stage')).toBeInTheDocument();
    expect(within(viewer).getByRole('button', { name: 'Cerrar el vídeo' })).toBeInTheDocument();
  });

  test('previous / next walk through the videos and stop at both ends', async () => {
    render(<App />);
    await goTo('Vídeos');
    fireEvent.click(playButtons()[0]);
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('1 / 10')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Vídeo anterior' })).toBeDisabled();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Vídeo siguiente' }));
    expect(within(dialog).getByText('2 / 10')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(within(dialog).getByText('1 / 10')).toBeInTheDocument();
  });

  test('arrow keys inside the player do not turn the page behind it', async () => {
    render(<App />);
    await goTo('Vídeos');
    fireEvent.click(playButtons()[0]);
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(screen.getByRole('heading', { level: 2, name: 'Vídeos' })).toBeInTheDocument();
  });

  test('a video file opens in a muted, autoplaying video player (no link to an original)', async () => {
    render(<App />);
    await goTo('Redes sociales');
    fireEvent.click(screen.getByRole('button', { name: /Montaje skate/ }));

    const dialog = screen.getByRole('dialog');
    const video = dialog.querySelector('video');
    expect(video.getAttribute('src')).toMatch(/video-8\.mp4$/);
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video).toHaveAttribute('controls');
    expect(within(dialog).queryByRole('link')).not.toBeInTheDocument();
  });

  test('an Instagram reel opens in the Instagram embed', async () => {
    render(<App />);
    await goTo('Redes sociales');
    fireEvent.click(screen.getByRole('button', { name: /Vlog viaje a La Réunion/ }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByTitle(/La Réunion/)).toHaveAttribute(
      'src',
      'https://www.instagram.com/reel/DSzbShhCG3X/embed/'
    );
    expect(within(dialog).getByRole('link', { name: /Ver en Instagram/ })).toBeInTheDocument();
  });
});

describe('script reader', () => {
  // The PDF engine is loaded on demand; here it is replaced by a stand-in that "has" three pages.
  const pages = { getViewport: () => ({ width: 595, height: 842 }), render: () => ({ promise: Promise.resolve(), cancel() {} }) };
  const document3 = { numPages: 3, getPage: () => Promise.resolve(pages), destroy() {} };

  beforeAll(() => {
    jest.doMock('./lib/pdfjs', () => ({
      __esModule: true,
      default: { getDocument: () => ({ promise: Promise.resolve(document3), destroy() {} }) },
    }));
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({}));
  });

  afterAll(() => jest.dontMock('./lib/pdfjs'));

  test('opens the PDF, shows the page count, flips pages, and offers the download', async () => {
    render(<App />);
    await goTo('Guiones');
    fireEvent.click(screen.getByRole('button', { name: /Leer: Minirrelato. The Lady in Distress/ }));

    const dialog = screen.getByRole('dialog');
    expect(await within(dialog).findByText('Página 1 / 3')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Página anterior' })).toBeDisabled();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Página siguiente' }));
    expect(within(dialog).getByText('Página 2 / 3')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(within(dialog).getByText('Página 3 / 3')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Página siguiente' })).toBeDisabled();
    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(within(dialog).getByText('Página 2 / 3')).toBeInTheDocument();

    expect(within(dialog).queryByRole('button', { name: /Acercar|Alejar/ })).not.toBeInTheDocument();
    expect(within(dialog).getByRole('link', { name: /Descargar PDF/ })).toHaveAttribute(
      'href',
      expect.stringMatching(/document-11\.pdf$/)
    );
  });

  test('previous / next stay among the scripts (1 / 3)', async () => {
    render(<App />);
    await goTo('Guiones');
    fireEvent.click(screen.getByRole('button', { name: /Leer: Minirrelato. Grief/ }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Guion 2 / 3')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Guion siguiente' }));
    expect(within(dialog).getByText('Guion 3 / 3')).toBeInTheDocument();
    expect(await within(dialog).findByText('Página 1 / 3')).toBeInTheDocument();
  });
});

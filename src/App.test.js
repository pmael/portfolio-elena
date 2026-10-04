import { act, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';

// The whole page, rendered once per test (the IntersectionObserver stand-in in setupTests.js makes every
// animation reach its final state immediately).

test('the intro title is "PORTFOLIO AUDIOVISUAL" with the name underneath', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: 'PORTFOLIO AUDIOVISUAL' })).toBeInTheDocument();
  expect(screen.getByText('Elena Morales')).toBeInTheDocument();
});

test('has the ten slides of the reference deck, in order', () => {
  const { container } = render(<App />);
  const ids = Array.from(container.querySelectorAll('main > section')).map((section) => section.id);
  expect(ids).toEqual([
    'inicio',
    'quien-soy',
    'trayectoria',
    'softwares',
    'podcast',
    'videos',
    'videoclips',
    'redes-sociales',
    'guiones',
    'contacto',
  ]);
});

test('every slide has its title', () => {
  render(<App />);
  [
    '¿Quién Soy?',
    'Mi trayectoria',
    'Softwares de edición',
    'Podcast',
    'Vídeos',
    'Videoclips musicales',
    'Redes sociales',
    'Guiones (En inglés)',
    '¡Contáctame!',
  ].forEach((name) => {
    expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
  });
});

describe('highlighted words', () => {
  test('are bold and come from the text of the "Mi trayectoria" slide', () => {
    const { container } = render(<App />);
    const words = Array.from(container.querySelectorAll('#trayectoria strong')).map((node) => node.textContent);
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
  ])('%s shows %i filled stars out of 5', (name, filled) => {
    render(<App />);
    const rating = screen.getByRole('img', { name: `${name}: ${filled} de 5 estrellas` });
    expect(rating.querySelectorAll('.rating__star')).toHaveLength(5);
    expect(rating.querySelectorAll('.rating__full')).toHaveLength(filled);
  });

  test('each tool shows its logo', () => {
    render(<App />);
    expect(screen.getAllByRole('img', { name: /^Logo de / })).toHaveLength(8);
  });
});

describe('contact slide', () => {
  test('Instagram and LinkedIn open the right profiles in a new tab', () => {
    render(<App />);
    const links = within(document.getElementById('contacto'));

    const linkedin = links.getByRole('link', { name: /LinkedIn/ });
    expect(linkedin).toHaveAttribute('href', 'https://www.linkedin.com/in/eleemj');
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', expect.stringContaining('noopener'));

    const instagramLinks = links.getAllByRole('link', { name: /Instagram/ });
    expect(instagramLinks).toHaveLength(2); // the logo and the QR code
    instagramLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', 'https://www.instagram.com/eleemj?stkn=d2EydXljaHkzMnFw');
      expect(link).toHaveAttribute('target', '_blank');
    });
  });

  test('the email is a mailto link', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /eleemjmnz@gmail.com/ })).toHaveAttribute(
      'href',
      'mailto:eleemjmnz@gmail.com'
    );
  });

  test('both Elenas are there, ready to pivot', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('.elena img')).toHaveLength(2);
  });

});

describe('video player', () => {
  const playButtons = () => screen.getAllByRole('button', { name: /^Reproducir:/ });

  test('only the 8 slots that have a video are playable; the rest stay blank', () => {
    const { container } = render(<App />);
    expect(playButtons()).toHaveLength(8);
    expect(container.querySelectorAll('.video-card--blank')).toHaveLength(5);
  });

  test('clicking a video opens it muted, with autoplay, and Escape closes it', () => {
    jest.useFakeTimers();
    render(<App />);

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
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    jest.useRealTimers();
  });

  test('previous / next walk through the videos and stop at both ends', () => {
    render(<App />);
    fireEvent.click(playButtons()[0]);
    const dialog = screen.getByRole('dialog');

    expect(within(dialog).getByText('1 / 8')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Vídeo anterior' })).toBeDisabled();

    fireEvent.click(within(dialog).getByRole('button', { name: 'Vídeo siguiente' }));
    expect(within(dialog).getByText('2 / 8')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(within(dialog).getByText('1 / 8')).toBeInTheDocument();
  });

  test('an Instagram reel opens in the Instagram embed', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Vlog viaje a La Réunion/ }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByTitle(/La Réunion/)).toHaveAttribute(
      'src',
      'https://www.instagram.com/reel/DSzbShhCG3X/embed/'
    );
    expect(within(dialog).getByRole('link', { name: /Ver en Instagram/ })).toBeInTheDocument();
  });
});

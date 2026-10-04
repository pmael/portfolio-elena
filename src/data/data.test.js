import { CONTACT } from './links';
import { MAX_RATING, SOFTWARE } from './software';
import { PLAYABLE_VIDEOS, VIDEO_SLIDES, isDocument, mediaOf } from './videos';
import { STARS } from './stars';

// These tests pin down what was specified for the portfolio, so a later edit cannot silently change it.

describe('software ratings (as in the reference slide)', () => {
  const ratings = Object.fromEntries(SOFTWARE.map(({ name, rating }) => [name, rating]));

  test('each tool has the right number of stars', () => {
    expect(ratings).toEqual({
      'DaVinci Resolve': 3,
      'Adobe Premiere Pro': 3,
      CapCut: 4,
      'Adobe After Effects': 2,
      'Adobe Lightroom': 3,
      'Adobe Photoshop': 1,
      Audacity: 4,
      Canva: 4,
    });
  });

  test('no rating goes beyond the number of stars', () => {
    SOFTWARE.forEach(({ rating }) => {
      expect(rating).toBeGreaterThanOrEqual(0);
      expect(rating).toBeLessThanOrEqual(MAX_RATING);
    });
  });
});

describe('video slots', () => {
  const slots = VIDEO_SLIDES.flatMap((slide) => slide.items);
  const slot = (n) => slots.find((item) => item.n === n);

  test('are numbered 1 to 13 without gaps, in order', () => {
    expect(slots.map((item) => item.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  test.each([
    [1, 'EXBpnLsG9fc'],
    [2, 'RmsB_YfIp6M'],
    [3, '76VeTAbXUxI'],
    [4, 'E30ZGtSz7TQ'],
    [5, 'ikuM2jn-PIM'],
    [6, 'j_IxsMAV9qM'],
  ])('video %i is the YouTube video %s', (n, id) => {
    expect(slot(n).media).toEqual({ provider: 'youtube', id });
  });

  test.each([
    [7, 'DSzbShhCG3X'],
    [9, 'DERoZsLR6jz'],
  ])('video %i is the Instagram reel %s, with a poster', (n, code) => {
    expect(slot(n).media).toEqual({ provider: 'instagram', code });
    expect(slot(n).poster).toBeTruthy();
  });

  test.each([8, 10])('video %i is a video file that ships with the site, with a poster', (n) => {
    expect(slot(n).media.provider).toBe('file');
    expect(slot(n).media.src).toMatch(/video-\d+\.mp4$/);
    expect(slot(n).poster).toBeTruthy();
  });

  test.each([11, 12, 13])('script %i is a PDF document, with a poster', (n) => {
    expect(slot(n).media.provider).toBe('pdf');
    expect(slot(n).media.src).toMatch(new RegExp(`document-${n}\\.pdf$`));
    expect(isDocument(slot(n))).toBe(true);
    expect(slot(n).href).toBe(slot(n).media.src);
    expect(slot(n).poster).toBeTruthy();
  });

  test('every slot now has something to open', () => {
    expect(slots.every((item) => item.playable)).toBe(true);
    expect(PLAYABLE_VIDEOS.map((item) => item.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
  });

  test('a slot without url or file stays a blank space', () => {
    expect(mediaOf({ caption: 'later' })).toBeNull();
    expect(mediaOf({ url: null })).toBeNull();
  });
});

describe('contact links', () => {
  test('Instagram is the link that was given', () => {
    expect(CONTACT.instagram).toBe('https://www.instagram.com/eleemj?stkn=d2EydXljaHkzMnFw');
  });

  test('LinkedIn is absolute (a bare "www." address would resolve relative to this site)', () => {
    expect(CONTACT.linkedin).toBe('https://www.linkedin.com/in/eleemj');
  });

  test('the email address matches the reference', () => {
    expect(CONTACT.email).toBe('eleemjmnz@gmail.com');
  });
});

describe('star field', () => {
  test('keeps the 52 sparkles of the reference slides, all inside the 1920 x 1080 canvas', () => {
    expect(STARS).toHaveLength(52);
    STARS.forEach(([x, y, size]) => {
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(1920);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(1080);
      expect(size).toBeGreaterThan(20);
    });
  });
});

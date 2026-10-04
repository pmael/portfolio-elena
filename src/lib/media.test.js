import { embedUrl, parseMediaUrl, youtubeThumbnail } from './media';

describe('parseMediaUrl', () => {
  test.each([
    ['https://youtu.be/EXBpnLsG9fc?is=DFdHPStw8igq1tFr', 'EXBpnLsG9fc'],
    ['https://youtu.be/RmsB_YfIp6M?is=xoOTNTwpbv0QG55H', 'RmsB_YfIp6M'],
    ['https://youtu.be/76VeTAbXUxI', '76VeTAbXUxI'],
    ['https://youtu.be/ikuM2jn-PIM', 'ikuM2jn-PIM'],
    ['https://www.youtube.com/watch?v=E30ZGtSz7TQ&t=10s', 'E30ZGtSz7TQ'],
    ['https://m.youtube.com/shorts/j_IxsMAV9qM', 'j_IxsMAV9qM'],
  ])('understands the YouTube link %s', (url, id) => {
    expect(parseMediaUrl(url)).toEqual({ provider: 'youtube', id });
  });

  test.each([
    ['https://www.instagram.com/reel/DSzbShhCG3X/?stkn=MWRqbmpqN3czYnJ6MQ==', 'DSzbShhCG3X'],
    ['https://www.instagram.com/reel/DERoZsLR6jz/?stkn=MWZzbThicjY4c2NleQ==', 'DERoZsLR6jz'],
    ['https://instagram.com/p/ABC_def-123/', 'ABC_def-123'],
  ])('understands the Instagram link %s', (url, code) => {
    expect(parseMediaUrl(url)).toEqual({ provider: 'instagram', code });
  });

  test.each([null, undefined, '', 'not a url', 'https://example.com/video', 'https://youtu.be/short'])(
    'returns null for %p',
    (value) => {
      expect(parseMediaUrl(value)).toBeNull();
    }
  );
});

describe('embedUrl', () => {
  test('YouTube starts muted, autoplays and stays on the privacy-friendly domain', () => {
    const url = new URL(embedUrl({ provider: 'youtube', id: 'EXBpnLsG9fc' }));
    expect(url.origin).toBe('https://www.youtube-nocookie.com');
    expect(url.pathname).toBe('/embed/EXBpnLsG9fc');
    expect(url.searchParams.get('mute')).toBe('1');
    expect(url.searchParams.get('autoplay')).toBe('1');
  });

  test('Instagram uses the reel embed page', () => {
    expect(embedUrl({ provider: 'instagram', code: 'DSzbShhCG3X' })).toBe(
      'https://www.instagram.com/reel/DSzbShhCG3X/embed/'
    );
  });
});

test('youtubeThumbnail builds the HD thumbnail address by default', () => {
  expect(youtubeThumbnail('EXBpnLsG9fc')).toBe('https://i.ytimg.com/vi/EXBpnLsG9fc/maxresdefault.jpg');
  expect(youtubeThumbnail('EXBpnLsG9fc', 'hqdefault')).toBe('https://i.ytimg.com/vi/EXBpnLsG9fc/hqdefault.jpg');
});

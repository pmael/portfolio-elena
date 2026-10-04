const YOUTUBE_ID = /^[\w-]{11}$/;
const INSTAGRAM_CODE = /^[\w-]+$/;

/**
 * Understands the YouTube / Instagram links used in the portfolio (youtu.be/…, youtube.com/watch?v=…,
 * instagram.com/reel/…, tracking params like ?is= or ?stkn= are ignored).
 * Returns { provider: 'youtube', id } | { provider: 'instagram', code } | null.
 */
export function parseMediaUrl(rawUrl) {
  if (!rawUrl) return null;

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^(www|m)\./, '');
  const parts = url.pathname.split('/').filter(Boolean);

  if (host === 'youtu.be') {
    return YOUTUBE_ID.test(parts[0] || '') ? { provider: 'youtube', id: parts[0] } : null;
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    let id = null;
    if (parts[0] === 'watch') id = url.searchParams.get('v');
    else if (['embed', 'shorts', 'live', 'v'].includes(parts[0])) id = parts[1];
    return YOUTUBE_ID.test(id || '') ? { provider: 'youtube', id } : null;
  }

  if (host === 'instagram.com') {
    const at = parts.findIndex((part) => ['reel', 'reels', 'p', 'tv'].includes(part));
    const code = at >= 0 ? parts[at + 1] : null;
    return code && INSTAGRAM_CODE.test(code) ? { provider: 'instagram', code } : null;
  }

  return null;
}

/**
 * The iframe address that plays the video. YouTube starts muted (autoplay is only allowed muted anyway, and
 * Elena asked for silence on launch); the viewer can unmute from the player. Instagram's embed offers no
 * such switch, so it simply loads its own player.
 */
export function embedUrl(media) {
  if (media.provider === 'youtube') {
    const params = new URLSearchParams({
      autoplay: '1',
      mute: '1',
      playsinline: '1',
      rel: '0',
      modestbranding: '1',
    });
    return `https://www.youtube-nocookie.com/embed/${media.id}?${params}`;
  }
  return `https://www.instagram.com/reel/${media.code}/embed/`;
}

export const youtubeThumbnail = (id, quality = 'maxresdefault') =>
  `https://i.ytimg.com/vi/${id}/${quality}.jpg`;

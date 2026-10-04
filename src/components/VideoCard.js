import { useState } from 'react';
import { youtubeThumbnail } from '../lib/media';
import cx from '../lib/cx';
import { useVideoPlayer } from './VideoPlayer';
import instagramLogo from '../assets/images/instagram-logo.png';
import './VideoCard.css';

// YouTube answers a missing HD thumbnail with a tiny grey placeholder (120px wide) instead of an error.
const PLACEHOLDER_WIDTH = 120;

function Poster({ item }) {
  const { media, poster } = item;
  const [src, setSrc] = useState(
    poster || (media.provider === 'youtube' ? youtubeThumbnail(media.id) : null)
  );
  const [loaded, setLoaded] = useState(false);

  if (!src) {
    // An Instagram reel without a poster image: a soft gradient with the Instagram logo.
    return (
      <span className="video-card__fallback" aria-hidden="true">
        <img src={instagramLogo} alt="" width="157" height="157" />
      </span>
    );
  }

  const fallBackToSmallerThumbnail = () => {
    if (media.provider === 'youtube' && !src.endsWith('/hqdefault.jpg')) {
      setSrc(youtubeThumbnail(media.id, 'hqdefault'));
    }
  };

  return (
    <img
      className={cx('video-card__poster', loaded && 'is-loaded')}
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      onLoad={(event) => {
        if (media.provider === 'youtube' && event.currentTarget.naturalWidth <= PLACEHOLDER_WIDTH) {
          fallBackToSmallerThumbnail();
        } else {
          setLoaded(true);
        }
      }}
      onError={fallBackToSmallerThumbnail}
    />
  );
}

/**
 * One slot of a video slide. Playable slots show the video's thumbnail and open the player on click;
 * slots without a video stay a quiet, empty placeholder.
 */
export default function VideoCard({ item }) {
  const { open } = useVideoPlayer();

  if (!item.playable) {
    return <div className="video-card video-card--blank" aria-hidden="true" />;
  }

  return (
    <button
      type="button"
      className="video-card"
      onClick={() => open(item.n)}
      aria-label={`Reproducir: ${item.caption.replace(/\s*\n\s*/g, ' ')}`}
    >
      <Poster item={item} />
      <span className="video-card__shade" aria-hidden="true" />
      <span className="video-card__play" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M8 5.2v13.6a.6.6 0 0 0 .92.5l10.7-6.8a.6.6 0 0 0 0-1L8.92 4.7A.6.6 0 0 0 8 5.2z" />
        </svg>
      </span>
    </button>
  );
}

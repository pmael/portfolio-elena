import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import { PODCAST } from '../data/content';
import { PODCAST_WEBSITE } from '../data/links';
import cover from '../assets/images/podcast-cover.webp';

// A role is plain text, or text around the underlined "página web" (a link as soon as PODCAST_WEBSITE is set).
function Role({ role }) {
  if (typeof role === 'string') return role;

  return (
    <>
      {role.before}
      {PODCAST_WEBSITE ? (
        <a href={PODCAST_WEBSITE} target="_blank" rel="noopener noreferrer">
          {role.link}
        </a>
      ) : (
        <span className="underlined">{role.link}</span>
      )}
      {role.after}
    </>
  );
}

export default function Podcast() {
  return (
    <Slide id="podcast">
      <AnimatedTitle id="podcast-title" lines={PODCAST.title} />
      <div className="slide__body podcast">
        <Reveal as="figure" className="podcast__cover">
          <img src={cover} alt={PODCAST.coverAlt} width="1000" height="1000" decoding="async" />
          <figcaption>{PODCAST.date}</figcaption>
        </Reveal>

        <div className="podcast__text">
          <Reveal className="podcast__intro" delay={150}>
            {PODCAST.intro.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </Reveal>

          <Reveal delay={250}>
            <p className="podcast__heading">{PODCAST.rolesHeading}</p>
          </Reveal>
          <ul className="podcast__roles">
            {PODCAST.roles.map((role, index) => (
              <Reveal as="li" delay={index * 70} key={index}>
                <Role role={role} />
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Slide>
  );
}

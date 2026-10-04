import Slide from '../components/Slide';
import AnimatedTitle from '../components/AnimatedTitle';
import Reveal from '../components/Reveal';
import useInView from '../hooks/useInView';
import cx from '../lib/cx';
import { CONTACT } from '../data/links';
import { CONTACT_COPY } from '../data/content';
import elenaLeft from '../assets/images/elena-left.png';
import elenaRight from '../assets/images/elena-right.png';
import instagramLogo from '../assets/images/instagram-logo.png';
import linkedinLogo from '../assets/images/linkedin-logo.png';
import instagramQr from '../assets/images/instagram-qr.png';

const external = { target: '_blank', rel: 'noopener noreferrer' };

export default function Contact() {
  // The two Elenas only pivot while this slide is on screen.
  const [ref, { visible }] = useInView({ threshold: 0.1 });

  return (
    <Slide id="contacto" className="slide--contact">
      <AnimatedTitle id="contacto-title" lines={CONTACT_COPY.title} />

      <div ref={ref} className={cx('slide__body', 'contact', visible && 'is-live')}>
        <Reveal className="elena elena--left">
          <img src={elenaLeft} alt="Elena bailando con un brazo en alto" width="671" height="671" />
        </Reveal>

        <div className="contact__center">
          <Reveal as="p" className="contact__email">
            <a href={`mailto:${CONTACT.email}`} aria-label={`${CONTACT_COPY.emailLabel}: ${CONTACT.email}`}>
              {CONTACT.email}
            </a>
          </Reveal>

          <Reveal className="contact__socials" delay={150}>
            <a href={CONTACT.linkedin} aria-label={CONTACT_COPY.linkedinLabel} {...external}>
              <img src={linkedinLogo} alt="" width="150" height="150" />
            </a>
            <a href={CONTACT.instagram} aria-label={CONTACT_COPY.instagramLabel} {...external}>
              <img src={instagramLogo} alt="" width="157" height="157" />
            </a>
          </Reveal>

          <Reveal className="contact__qr" delay={300}>
            <a href={CONTACT.instagram} aria-label={CONTACT_COPY.instagramLabel} {...external}>
              <img src={instagramQr} alt={CONTACT_COPY.qrAlt} width="215" height="247" />
            </a>
            <p>{CONTACT_COPY.qrCaption}</p>
          </Reveal>
        </div>

        <Reveal className="elena elena--right">
          <img src={elenaRight} alt="" width="607" height="607" />
        </Reveal>
      </div>
    </Slide>
  );
}

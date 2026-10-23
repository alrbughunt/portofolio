import { ArrowUpRight, Download, Github, Linkedin, Mail, MapPin, MessageCircle } from 'lucide-react';
import { contact, site, ui } from '../../constants';
import { useCanvasCapability } from '../../utils/useCanvasCapability';

 type ContactProps = { onGlobeHover: (hovered: boolean) => void };

function StaticGlobe() {
  return <div className="static-globe contact-static-globe" aria-hidden="true"><span className="globe-ring ring-a" /><span className="globe-ring ring-b" /><span className="globe-ring ring-c" />{Array.from({ length: 8 }).map((_, index) => <i key={index} className={`globe-node globe-node-${index + 1}`} />)}<i className="globe-core" /></div>;
}

export default function Contact({ onGlobeHover }: ContactProps) {
  const canUse3D = useCanvasCapability();

  return (
    <section className="contact-section section-wrap" id="contact" aria-labelledby="contact-heading">
      <div className="contact-copy">
        <p className="eyebrow">{contact.eyebrow}</p>
        <h2 id="contact-heading">{contact.title}</h2>
        <p className="contact-description">{contact.description}</p>
        <div className="contact-main-actions">
          <a className="button button-primary" data-cursor="interactive" href={site.whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16} aria-hidden="true" />{ui.contactWhatsapp}<ArrowUpRight size={15} aria-hidden="true" /></a>
          <a className="button button-outline" data-cursor="interactive" href={`mailto:${site.email}`}><Mail size={16} aria-hidden="true" />{ui.contactEmail}</a>
        </div>
        <div className="contact-details">
          <div><span className="contact-detail-icon"><MapPin size={16} aria-hidden="true" /></span><span className="contact-detail-label">{contact.locationLabel}</span><strong>{site.location}</strong></div>
          <div><span className="contact-detail-icon"><Mail size={16} aria-hidden="true" /></span><span className="contact-detail-label">{contact.emailLabel}</span><a href={`mailto:${site.email}`}>{site.email}</a></div>
        </div>
        <div className="contact-secondary">
          <p>{contact.secondaryLabel}</p>
          <div className="contact-secondary-links">
            <a href={site.cv} download><Download size={15} aria-hidden="true" />{ui.downloadCv}</a>
            <a href={site.portfolioPdf} download><Download size={15} aria-hidden="true" />{ui.downloadPortfolio}</a>
            <a href={site.github} target="_blank" rel="noreferrer"><Github size={15} aria-hidden="true" />{ui.viewGithub}</a>
            <a href={site.linkedin} target="_blank" rel="noreferrer"><Linkedin size={15} aria-hidden="true" />{ui.viewLinkedin}</a>
          </div>
        </div>
      </div>
      <div
        className="contact-visual"
        role="img"
        aria-label={ui.contactVisual}
        tabIndex={0}
        onMouseEnter={() => onGlobeHover(true)}
        onMouseLeave={() => onGlobeHover(false)}
        onFocus={() => onGlobeHover(true)}
        onBlur={() => onGlobeHover(false)}
      >
        {canUse3D ? <div className="contact-scene-placeholder" aria-hidden="true" /> : <StaticGlobe />}
        <div className="contact-visual-label"><span className="live-dot" /><span>{site.location}</span></div>
      </div>
    </section>
  );
}

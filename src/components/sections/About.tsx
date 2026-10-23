import { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Database, Network, ShieldCheck, TerminalSquare } from 'lucide-react';
import { about, site, sections, ui } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';

const cardIcons = [TerminalSquare, Network, Database, ShieldCheck];

export default function About() {
  const [photoFailed, setPhotoFailed] = useState(false);

  return (
    <SectionWrapper id="about" eyebrow={sections.about.eyebrow} title={sections.about.title}>
      <div className="about-intro-grid">
        <div className="about-intro-copy">
          <p>{about.description}</p>
          <div className="about-location-row"><CheckCircle2 size={16} aria-hidden="true" /><span>{site.location}</span><span className="about-separator" /><a href={site.github} target="_blank" rel="noreferrer">@{site.handle}<ArrowUpRight size={13} aria-hidden="true" /></a></div>
        </div>
        <div className="profile-card">
          <div className="profile-photo-wrap">
            {photoFailed ? <div className="profile-initials" aria-hidden="true">{site.name.charAt(0)}.</div> : <img src={site.photo} alt={site.name} loading="lazy" onError={() => setPhotoFailed(true)} />}
          </div>
          <div className="profile-card-copy"><span className="profile-card-label">{ui.profileLabel}</span><strong>{site.name}</strong><span>{site.title}</span></div>
          <span className="profile-card-corner" aria-hidden="true">↗</span>
        </div>
      </div>
      <div className="about-card-grid">
        {about.cards.map((card, index) => {
          const Icon = cardIcons[index];
          return (
            <article className="about-card" key={card.number}>
              <div className="about-card-top"><span>{card.number}</span><Icon size={20} strokeWidth={1.6} aria-hidden="true" /></div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <div className="card-bottom-line" />
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

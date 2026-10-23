import { ArrowUpRight, BadgeCheck } from 'lucide-react';
import { certifications, sections } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';

type CertificationsProps = { hoveredCertification: number | null; onCertificationHover: (index: number | null) => void };

export default function Certifications({ hoveredCertification, onCertificationHover }: CertificationsProps) {
  return (
    <SectionWrapper id="certification" eyebrow={sections.certification.eyebrow} title={sections.certification.title} description={sections.certification.description} className="certification-section">
      <div className="certification-list">
        {certifications.map((item, index) => (
          <article
            className={`certification-row${hoveredCertification === index ? ' is-active' : ''}`}
            key={item.title}
            tabIndex={0}
            onMouseEnter={() => onCertificationHover(index)}
            onMouseLeave={() => onCertificationHover(null)}
            onFocus={() => onCertificationHover(index)}
            onBlur={() => onCertificationHover(null)}
          >
            <span className="certification-index">0{index + 1}</span>
            <span className="certification-icon"><BadgeCheck size={19} aria-hidden="true" /></span>
            <div className="certification-copy"><h3>{item.title}</h3><p>{item.provider}</p></div>
            <ArrowUpRight className="certification-arrow" size={18} aria-hidden="true" />
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}

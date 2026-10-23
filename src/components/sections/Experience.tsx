import { BriefcaseBusiness, Flag, FlaskConical, GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { experience, experienceKindLabels, sections, ui } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';
import type { ExperienceItem } from '../../types';

type ExperienceProps = { onExperienceHover: (index: number | null) => void };

const timelineIcons: Record<ExperienceItem['kind'], typeof GraduationCap> = {
  education: GraduationCap,
  practice: FlaskConical,
  work: BriefcaseBusiness,
  award: Flag,
  community: Users,
  research: ShieldCheck,
};

export default function Experience({ onExperienceHover }: ExperienceProps) {
  return (
    <SectionWrapper id="experience" eyebrow={sections.experience.eyebrow} title={sections.experience.title} description={sections.experience.description} className="experience-section">
      <VerticalTimeline lineColor="rgba(93, 230, 208, 0.22)">
        {experience.map((item, index) => {
          const Icon = timelineIcons[item.kind];
          return (
            <VerticalTimelineElement
              key={`${item.organization}-${index}`}
              date={item.date || undefined}
              iconStyle={{ background: '#102638', color: '#5de6d0', boxShadow: '0 0 0 2px #5de6d0' }}
              contentStyle={{ background: '#0c1929', color: '#e7f0f7', border: '1px solid rgba(93,230,208,0.15)', boxShadow: 'none' }}
              contentArrowStyle={{ borderRight: '7px solid rgba(93,230,208,0.2)' }}
              icon={<Icon size={18} aria-hidden="true" />}
            >
              <div className="timeline-interaction" tabIndex={0} onMouseEnter={() => onExperienceHover(index)} onMouseLeave={() => onExperienceHover(null)} onFocus={() => onExperienceHover(index)} onBlur={() => onExperienceHover(null)}>
                <p className="timeline-kicker">{item.date || experienceKindLabels[item.kind] || ui.timelineDateUnavailable}</p>
                <h3 className="timeline-role">{item.role}</h3>
                <h4 className="timeline-organization">{item.organization}</h4>
                <p className="timeline-description">{item.description}</p>
              </div>
            </VerticalTimelineElement>
          );
        })}
      </VerticalTimeline>
    </SectionWrapper>
  );
}

import { useEffect } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { skills, sections, site, ui } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';
import { useCanvasCapability } from '../../utils/useCanvasCapability';

type SkillsProps = {
  selectedSkill: string | null;
  hoveredSkill: string | null;
  onSkillSelect: (id: string) => void;
  onSkillHover: (id: string | null) => void;
};

function StaticGlobe() {
  return (
    <div className="static-globe" aria-hidden="true">
      <span className="globe-ring ring-a" /><span className="globe-ring ring-b" /><span className="globe-ring ring-c" />
      {Array.from({ length: 8 }).map((_, index) => <i key={index} className={`globe-node globe-node-${index + 1}`} />)}
      <i className="globe-core" />
    </div>
  );
}

export default function Skills({ selectedSkill, hoveredSkill, onSkillSelect, onSkillHover }: SkillsProps) {
  const canUse3D = useCanvasCapability();
  const selected = skills.find((group) => group.id === selectedSkill);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedSkill) onSkillSelect(selectedSkill);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedSkill, onSkillSelect]);

  return (
    <SectionWrapper id="skills" eyebrow={sections.skills.eyebrow} title={sections.skills.title} description={sections.skills.description} className="skills-section">
      <div className="skills-showcase">
        <div className="skills-showcase-visual" role="group" aria-label={ui.skillsVisual}>
          {canUse3D ? <div className="skills-graph-placeholder" aria-hidden="true" /> : <StaticGlobe />}
          <div className="tech-orbit-labels">
            {skills.map((group, index) => (
              <button
                type="button"
                className={`tech-orbit-label tech-orbit-label-${index + 1}${selectedSkill === group.id ? ' is-selected' : ''}${hoveredSkill === group.id ? ' is-hovered' : ''}`}
                key={group.id}
                aria-pressed={selectedSkill === group.id}
                aria-label={`${group.title}. ${ui.skillSelectHint}`}
                onMouseEnter={() => onSkillHover(group.id)}
                onMouseLeave={() => onSkillHover(null)}
                onFocus={() => onSkillHover(group.id)}
                onBlur={() => onSkillHover(null)}
                onClick={() => onSkillSelect(group.id)}
              >
                {group.title}
              </button>
            ))}
          </div>
        </div>
        <div className="skills-showcase-copy">
          <p className="eyebrow">{ui.skillsShowcaseEyebrow}</p>
          <h3>{ui.skillsShowcaseTitle}</h3>
          <p>{ui.skillsShowcaseDescription}</p>
          <p className="skills-interaction-hint">{ui.skillSelectHint}</p>
          <a className="text-link" href={site.github} target="_blank" rel="noreferrer">{ui.githubActivity}<ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>

      {selected ? (
        <div className="selected-skill-panel" role="region" aria-live="polite" aria-labelledby="selected-skill-title">
          <div className="selected-skill-copy">
            <p className="eyebrow">{ui.skillSelectedLabel}</p>
            <h3 id="selected-skill-title">{selected.title}</h3>
            <p>{selected.summary}</p>
            <ul>{selected.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <button type="button" className="selected-skill-close" onClick={() => onSkillSelect(selected.id)} aria-label={ui.skillPanelClose}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      <div className="skills-grid" role="list" aria-label={ui.skillListAria}>
        {skills.map((group) => (
          <article className={`skill-card${selectedSkill === group.id ? ' is-selected' : ''}`} role="listitem" key={group.id}>
            <div className="skill-card-heading"><span className="skill-mark">{group.mark}</span><span className="skill-index">/{group.id.toUpperCase()}</span></div>
            <h3>{group.title}</h3>
            <p>{group.summary}</p>
            <ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul>
            <button type="button" className="skill-card-action" aria-pressed={selectedSkill === group.id} onClick={() => onSkillSelect(group.id)} onMouseEnter={() => onSkillHover(group.id)} onMouseLeave={() => onSkillHover(null)} onFocus={() => onSkillHover(group.id)} onBlur={() => onSkillHover(null)}>
              {selectedSkill === group.id ? ui.skillPanelClose : ui.skillSelectedLabel}
            </button>
          </article>
        ))}
      </div>
    </SectionWrapper>
  );
}

import { Award, Flag, ShieldCheck, Trophy } from 'lucide-react';
import { achievements, sections } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';

type AchievementsProps = { hoveredAchievement: number | null; onAchievementHover: (index: number | null) => void };
const achievementIcons = [Trophy, Flag, ShieldCheck, ShieldCheck, ShieldCheck, Award];

export default function Achievements({ hoveredAchievement, onAchievementHover }: AchievementsProps) {
  return (
    <SectionWrapper id="achievement" eyebrow={sections.achievement.eyebrow} title={sections.achievement.title} description={sections.achievement.description} className="achievement-section">
      <div className="achievement-grid">
        {achievements.map((item, index) => {
          const Icon = achievementIcons[index];
          return (
            <article
              className={`achievement-card${hoveredAchievement === index ? ' is-active' : ''}`}
              key={item.title}
              tabIndex={0}
              data-cursor="interactive"
              onMouseEnter={() => onAchievementHover(index)}
              onMouseLeave={() => onAchievementHover(null)}
              onFocus={() => onAchievementHover(index)}
              onBlur={() => onAchievementHover(null)}
            >
              <div className="achievement-card-top"><Icon size={20} strokeWidth={1.5} aria-hidden="true" /><span>{item.type}</span></div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <span className="achievement-card-number">0{index + 1}</span>
            </article>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

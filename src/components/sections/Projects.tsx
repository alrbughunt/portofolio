import { useEffect, useState } from 'react';
import { ArrowUpRight, Activity, Globe, Network, Server, ShieldCheck, TerminalSquare } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { projects, sections, ui } from '../../constants';
import { SectionWrapper } from '../../hoc/SectionWrapper';
import type { Project } from '../../types';

const projectIcons: Record<Project['visual'], typeof ShieldCheck> = {
  terminal: TerminalSquare,
  server: Server,
  network: Network,
  shield: ShieldCheck,
  web: Globe,
  monitor: Activity,
};

export default function Projects() {
  const [isTouch, setIsTouch] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)');
    const update = () => setIsTouch(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  return (
    <SectionWrapper id="projects" eyebrow={sections.projects.eyebrow} title={sections.projects.title} description={sections.projects.description} className="projects-section">
      <div className="projects-grid">
        {projects.map((project, index) => {
          const Icon = projectIcons[project.visual];
          const hasLinks = Boolean(project.demo || project.repository);
          return (
            <motion.div
              key={project.number}
              initial={reduceMotion ? false : { opacity: 0, y: 26, scale: 0.985 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.16 }}
              transition={{ duration: 0.58, delay: reduceMotion ? 0 : (index % 3) * 0.09, ease: 'easeOut' }}
            >
              <Tilt
                tiltEnable={!isTouch && !reduceMotion}
                tiltMaxAngleX={7}
                tiltMaxAngleY={7}
                perspective={1150}
                scale={1.018}
                transitionSpeed={650}
                glareEnable={!isTouch && !reduceMotion}
                glareMaxOpacity={0.2}
                glareColor="#5de6d0"
                glarePosition="all"
                className="project-tilt"
              >
                <article className={`project-card project-card-${project.visual}`} data-cursor="interactive">
                  <div className="project-card-visual" aria-hidden="true">
                    <div className="project-visual-grid" />
                    <div className="project-visual-frame"><Icon size={40} strokeWidth={1.2} /><span className="project-visual-code">{project.number}</span></div>
                    <div className="project-visual-scanline" />
                    <div className="project-visual-orbit" />
                  </div>
                  <div className="project-card-body">
                    <div className="project-card-meta"><span>{project.number} / {ui.projectMeta}</span><span className="project-status-dot" /></div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <ul className="project-tags">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                    {hasLinks ? (
                      <div className="project-links" aria-label={ui.projectLinksAria}>
                        {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">{ui.openDemo}<ArrowUpRight size={14} aria-hidden="true" /></a> : null}
                        {project.repository ? <a href={project.repository} target="_blank" rel="noreferrer">{ui.openRepository}<ArrowUpRight size={14} aria-hidden="true" /></a> : null}
                      </div>
                    ) : null}
                  </div>
                </article>
              </Tilt>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

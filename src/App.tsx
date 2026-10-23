import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import CursorGlow from './components/layout/CursorGlow';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Achievements from './components/sections/Achievements';
import Certifications from './components/sections/Certifications';
import Contact from './components/sections/Contact';
import { navigation, site, ui } from './constants';

const GlobalSceneLayer = lazy(() => import('./components/canvas/GlobalScene'));

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredExperience, setHoveredExperience] = useState<number | null>(null);
  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null);
  const [hoveredCertification, setHoveredCertification] = useState<number | null>(null);
  const [globeHovered, setGlobeHovered] = useState(false);

  const selectSkill = useCallback((id: string) => {
    setSelectedSkill((current) => current === id ? null : id);
  }, []);
  const hoverSkill = useCallback((id: string | null) => setHoveredSkill(id), []);
  const hoverExperience = useCallback((index: number | null) => setHoveredExperience(index), []);
  const hoverAchievement = useCallback((index: number | null) => setHoveredAchievement(index), []);
  const hoverCertification = useCallback((index: number | null) => setHoveredCertification(index), []);
  const hoverGlobe = useCallback((hovered: boolean) => setGlobeHovered(hovered), []);

  useEffect(() => {
    document.title = site.pageTitle;
    const elements = navigation
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-24% 0px -58% 0px', threshold: [0.05, 0.15, 0.3, 0.5] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">{ui.skipLink}</a>
      <Suspense fallback={<div className="global-scene-loading-fallback" aria-hidden="true" />}>
        <GlobalSceneLayer
          activeSection={activeSection}
          selectedSkill={selectedSkill}
          hoveredSkill={hoveredSkill}
          onSkillSelect={selectSkill}
          onSkillHover={hoverSkill}
          hoveredExperience={hoveredExperience}
          hoveredAchievement={hoveredAchievement}
          hoveredCertification={hoveredCertification}
          globeHovered={globeHovered}
        />
      </Suspense>
      <Navbar activeSection={activeSection} />
      <main id="main-content">
        <Hero />
        <div className="content-shell">
          <About />
          <Skills selectedSkill={selectedSkill} hoveredSkill={hoveredSkill} onSkillSelect={selectSkill} onSkillHover={hoverSkill} />
          <Projects />
          <Experience onExperienceHover={hoverExperience} />
          <Achievements hoveredAchievement={hoveredAchievement} onAchievementHover={hoverAchievement} />
          <Certifications hoveredCertification={hoveredCertification} onCertificationHover={hoverCertification} />
          <Contact onGlobeHover={hoverGlobe} />
        </div>
      </main>
      <footer className="site-footer">
        <div className="footer-main">
          <a className="footer-brand" href="#home" aria-label={ui.brandHome}>{site.name}<span>.</span></a>
          <p>{ui.footer}</p>
          <a className="back-to-top" href="#home" aria-label={ui.backToTop}><ArrowUp size={17} aria-hidden="true" /></a>
        </div>
        <p className="footer-credit">{ui.credit}</p>
        <div className="footer-bottom"><span>{ui.copyright}</span><span>{site.location}</span></div>
      </footer>
      <CursorGlow />
    </>
  );
}

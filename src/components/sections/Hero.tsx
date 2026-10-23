import { ArrowDownRight, ArrowRight, Download, MapPin } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { hero, site, ui } from '../../constants';
import { useCanvasCapability } from '../../utils/useCanvasCapability';

function StaticServerVisual() {
  return (
    <div className="static-server-visual" aria-hidden="true">
      <div className="static-terminal">
        <span /><span /><span />
        <div className="terminal-lines"><i /><i /><i /><i /><i /></div>
      </div>
      <div className="static-rack">
        {Array.from({ length: 5 }).map((_, index) => <div className="static-rack-unit" key={index}><b /><i /><i /><i /></div>)}
      </div>
      <div className="visual-orbit orbit-one" />
      <div className="visual-orbit orbit-two" />
      <div className="visual-glow" />
    </div>
  );
}

export default function Hero() {
  const canUse3D = useCanvasCapability();
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <section className="hero-section" id="home" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-copy">
        <motion.p className="eyebrow hero-eyebrow" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="eyebrow-line" />{hero.eyebrow}
        </motion.p>
        <motion.h1 id="hero-title" aria-label={`${hero.greeting} ${hero.name}`} initial={reduceMotion ? false : { opacity: 0, y: 20 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.08 }}>
          <span aria-hidden="true">{hero.greeting}<br />
            <span className="hero-name">{hero.name.split('').map((character, index) => (
              <motion.span className="hero-name-letter" key={`${character}-${index}`} initial={reduceMotion ? false : { opacity: 0, y: 18, rotateX: -55 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 0.38, delay: 0.22 + index * 0.045 }}>
                {character}
              </motion.span>
            ))}<span className="hero-name-period">.</span></span>
          </span>
        </motion.h1>
        <motion.p className="hero-role" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.16 }}>
          {site.title}
        </motion.p>
        <motion.p className="hero-description" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.22 }}>
          {hero.description}
        </motion.p>
        <motion.div className="hero-location" initial={reduceMotion ? false : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }} transition={{ duration: 0.6, delay: 0.28 }}>
          <MapPin size={15} aria-hidden="true" /><span>{site.location}</span>
        </motion.div>
        <motion.div className="hero-actions" initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.32 }}>
          <a className="button button-primary" href={site.cv} download>
            <Download size={16} aria-hidden="true" />{ui.downloadCv}
          </a>
          <a className="button button-quiet" href="#projects">
            {ui.viewProjects}<ArrowRight size={16} aria-hidden="true" />
          </a>
        </motion.div>
        <motion.div className="hero-highlights" initial={reduceMotion ? false : { opacity: 0 }} animate={reduceMotion ? undefined : { opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          {hero.highlights.map((highlight, index) => (
            <div className="hero-highlight" key={highlight}>
              <span className="highlight-index">0{index + 1}</span><span>{highlight}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="hero-visual-wrap">
        <div className="hero-visual-topline"><span className="live-dot" /><span>{hero.statusLabel}</span><span className="visual-coordinate">{ui.systemCode}</span></div>
        <div className="hero-visual" role="img" aria-label={ui.heroVisual}>
          {canUse3D ? <div className="hero-scene-placeholder" aria-hidden="true" /> : <StaticServerVisual />}
        </div>
        <div className="visual-caption"><span className="caption-label">{hero.captionLabel}</span><span>{ui.focusAreaItems.map((item, index) => <span key={item}>{index > 0 ? <b>×</b> : null}{item} </span>)}</span></div>
        <a className="scroll-cue" href="#about"><span>{ui.scrollHint}</span><ArrowDownRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

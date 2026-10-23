import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../utils/motion';

type SectionWrapperProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionWrapper({ id, eyebrow, title, description, children, className = '' }: SectionWrapperProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <motion.section
      id={id}
      className={`section-wrap ${className}`}
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.12 }}
      variants={fadeUp}
      aria-labelledby={`${id}-heading`}
    >
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={`${id}-heading`}>{title}</h2>
        {description ? <p className="section-description">{description}</p> : null}
      </div>
      {children}
    </motion.section>
  );
}

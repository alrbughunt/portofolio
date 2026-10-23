export type SkillGroup = {
  id: string;
  title: string;
  summary: string;
  items: string[];
  mark: string;
};

export type Project = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  repository?: string;
  demo?: string;
  visual: 'terminal' | 'server' | 'network' | 'shield' | 'web' | 'monitor';
};

export type ExperienceItem = {
  organization: string;
  role: string;
  description: string;
  date: string;
  kind: 'education' | 'practice' | 'work' | 'award' | 'community' | 'research';
};

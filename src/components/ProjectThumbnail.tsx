import React from 'react';
import { Smartphone, Globe, Terminal as TerminalIcon, Wrench, LucideIcon } from 'lucide-react';

const PALETTES: [string, string][] = [
  ['from-blue-500', 'to-purple-600'],
  ['from-emerald-500', 'to-teal-600'],
  ['from-orange-500', 'to-pink-600'],
  ['from-indigo-500', 'to-blue-600'],
  ['from-purple-500', 'to-fuchsia-600'],
];

export function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function pickIcon(technologies: string[]): LucideIcon {
  const stack = technologies.join(' ').toLowerCase();
  if (stack.includes('android') || stack.includes('kotlin') || stack.includes('jetpack')) return Smartphone;
  if (stack.includes('node') || stack.includes('express') || stack.includes('mongodb')) return TerminalIcon;
  if (stack.includes('react') || stack.includes('angular') || stack.includes('html')) return Globe;
  return Wrench;
}

// Strips combining diacritical marks (U+0300–U+036F) left over after NFD
// normalization, so accented titles like "Portfólio" slugify to "portfolio".
export function slugifyTitle(title: string): string {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

interface ProjectThumbnailProps {
  title: string;
  technologies: string[];
}

// Substitui fotos de banco de imagens (não relacionadas aos projetos reais) por um
// preview gerado a partir dos próprios dados do projeto — honesto e consistente com
// a identidade visual do site, até existirem screenshots reais dos apps.
const ProjectThumbnail: React.FC<ProjectThumbnailProps> = ({ title, technologies }) => {
  const [from, to] = PALETTES[hashString(title) % PALETTES.length];
  const Icon = pickIcon(technologies);
  const slug = slugifyTitle(title);

  return (
    <div className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${from} ${to}`}>
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="absolute inset-0 bg-black/10" />
      <Icon className="relative h-14 w-14 text-white/90" strokeWidth={1.5} aria-hidden="true" />
      <span className="absolute bottom-3 left-4 right-4 truncate font-mono text-xs text-white/70">
        // {slug}
      </span>
    </div>
  );
};

export default ProjectThumbnail;

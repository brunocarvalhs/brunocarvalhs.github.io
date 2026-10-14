import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SkillsSection, { collectHardSkills } from './SkillsSection';
import { useGithubProjects } from '@/hooks/use-github-projects';
import { LanguageProvider } from '@/contexts/LanguageContext';

vi.mock('@/hooks/use-github-projects', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/hooks/use-github-projects')>()),
  useGithubProjects: vi.fn(),
}));

describe('collectHardSkills', () => {
  it('counts each project once, merges by url and dedupes names by slug', () => {
    const skills = collectHardSkills([
      { url: 'https://github.com/b/FriendsSecrets', technologies: ['Kotlin', 'Jetpack Compose'] },
      { url: 'https://github.com/b/friendssecrets', technologies: ['Kotlin', 'jetpack-compose', 'firebase'] },
      { url: 'https://github.com/b/Paguei', technologies: ['Kotlin', 'MVVM'] },
    ]);
    expect(skills).toEqual([
      { name: 'Kotlin', count: 2 },
      { name: 'firebase', count: 1 },
      { name: 'Jetpack Compose', count: 1 },
      { name: 'MVVM', count: 1 },
    ]);
  });

  it('returns nothing for no projects', () => {
    expect(collectHardSkills([])).toEqual([]);
  });
});

describe('<SkillsSection />', () => {
  it('renders hard skills from curated projects plus live repos, counting merged projects once', () => {
    localStorage.setItem('language', 'pt-BR');
    vi.mocked(useGithubProjects).mockReturnValue({
      loading: false,
      error: null,
      projects: [
        // same repo as the curated Friends Secrets entry — must not double count Kotlin
        { name: 'FriendsSecrets', description: null, htmlUrl: 'https://github.com/brunocarvalhs/FriendsSecrets', homepage: null, language: 'Kotlin', stars: 0, pushedAt: '', topics: [] },
        { name: 'Other', description: null, htmlUrl: 'https://github.com/brunocarvalhs/Other', homepage: null, language: 'Kotlin', stars: 0, pushedAt: '', topics: ['firebase'] },
      ],
    });
    render(
      <LanguageProvider>
        <SkillsSection />
      </LanguageProvider>
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Hard Skills' })).toBeInTheDocument();
    // portfolio.json: Friends Secrets + Paguei use Kotlin; live adds "Other" → 3
    const kotlin = screen.getByText('Kotlin').closest('div.rounded-xl');
    expect(kotlin).toHaveTextContent('3 projetos');
    expect(screen.getByText('firebase').closest('div.rounded-xl')).toHaveTextContent('1 projeto');
  });
});

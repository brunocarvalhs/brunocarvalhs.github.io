import { describe, expect, it } from 'vitest';
import { collectHardSkills } from './SkillsSection';

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

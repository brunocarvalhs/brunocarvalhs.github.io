import { describe, expect, it } from 'vitest';
import {
  formatProjectName,
  generateDescription,
  generateTitle,
  getCategoryFromFilename,
  getProjectKey,
  parseFrontmatter,
} from './documentUtils';

describe('parseFrontmatter', () => {
  it('reads known keys and strips the frontmatter from content', () => {
    const doc = parseFrontmatter('---\ntitle: T\nlastUpdated: 2025-01-02\ncategory: terms\nproject: Cestou\nurl: http://x\n---\n\n# Body', 'id1');
    expect(doc).toEqual({
      id: 'id1',
      title: 'T',
      description: '',
      lastUpdated: '2025-01-02',
      category: 'terms',
      project: 'Cestou',
      content: '# Body',
    });
  });

  it('falls back to defaults without frontmatter or with an unknown category', () => {
    const doc = parseFrontmatter('---\ncategory: bogus\n---\nx', 'id2');
    expect(doc.category).toBe('data');
    expect(doc.title).toBe('Título não informado');
    expect(doc.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(parseFrontmatter('plain', 'id3').content).toBe('plain');
  });
});

describe('document naming helpers', () => {
  it('maps filenames to categories', () => {
    expect(getCategoryFromFilename('privacy-policy.md')).toBe('privacy');
    expect(getCategoryFromFilename('terms-of-use.md')).toBe('terms');
    expect(getCategoryFromFilename('accessibility.md')).toBe('accessibility');
    expect(getCategoryFromFilename('cookies.md')).toBe('cookies');
    expect(getCategoryFromFilename('data_usage_and_deletion_policy.md')).toBe('data');
  });

  it('builds per-language titles and descriptions', () => {
    expect(generateTitle('privacy', 'en', 'Cestou')).toBe('Privacy Policy — Cestou');
    expect(generateTitle('terms', 'pt-BR')).toBe('Termos de Uso');
    expect(generateDescription('privacy', 'es', 'Cestou')).toBe('Política de privacidad para Cestou');
    expect(generateDescription('terms', 'pt-BR')).toBe('Termos de uso do portfólio');
  });

  it('round-trips project names and keys', () => {
    expect(formatProjectName('cestou')).toBe('Cestou');
    expect(formatProjectName('task-manager')).toBe('Task Manager');
    expect(getProjectKey('Task Manager')).toBe('task-manager');
    expect(getProjectKey('Cestou')).toBe('cestou');
  });
});

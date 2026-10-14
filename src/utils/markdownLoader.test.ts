import { describe, expect, it } from 'vitest';
import { getAllDocuments, getDocumentsByProject, getProjects, markdownToHtml } from './markdownLoader';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';

// Runs against the real files in src/data/legal-docs. These ids are
// deep-linked from published Android apps (/legal?doc=<id>) — they must exist
// and stay identical in every language.
const DEEP_LINKED_IDS = ['cestou-privacy-policy', 'cestou-terms-of-use'];

describe('legal docs pipeline', () => {
  it('discovers every doc in every language with stable ids', async () => {
    const idsByLanguage = await Promise.all(
      SUPPORTED_LANGUAGES.map(async (lang) => (await getAllDocuments(lang)).map((d) => d.id).sort())
    );
    expect(idsByLanguage[0]).toHaveLength(5);
    for (const ids of idsByLanguage) expect(ids).toEqual(idsByLanguage[0]);
    for (const id of DEEP_LINKED_IDS) expect(idsByLanguage[0]).toContain(id);
  });

  it('localizes titles and parses frontmatter dates', async () => {
    const [pt, en] = await Promise.all([getAllDocuments('pt-BR'), getAllDocuments('en')]);
    expect(pt.find((d) => d.id === 'cestou-privacy-policy')?.title).toBe('Política de Privacidade — Cestou');
    expect(en.find((d) => d.id === 'cestou-privacy-policy')?.title).toBe('Privacy Policy — Cestou');
    for (const doc of pt) expect(Number.isNaN(Date.parse(doc.lastUpdated))).toBe(false);
  });

  it('groups by project', async () => {
    expect((await getProjects('pt-BR')).sort()).toEqual(['cestou', 'friends_secrets']);
    expect(await getDocumentsByProject('Cestou', 'pt-BR')).toHaveLength(2);
    expect(await getDocumentsByProject(undefined, 'pt-BR')).toEqual([]);
  });

  it('renders markdown to HTML', async () => {
    expect(await markdownToHtml('# Oi')).toContain('<h1>Oi</h1>');
  });
});

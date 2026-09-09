import { describe, expect, it } from 'vitest';
import { slugify, getCompletions, COMMANDS } from './Terminal';

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Friends Secrets')).toBe('friends-secrets');
  });

  it('strips accents', () => {
    expect(slugify('Portfólio Pessoal')).toBe('portfolio-pessoal');
  });

  it('drops "!" specifically (e.g. "Paguei!")', () => {
    expect(slugify('Paguei!')).toBe('paguei');
  });
});

describe('getCompletions', () => {
  it('matches commands by prefix', () => {
    const { candidates } = getCompletions('he');
    expect(candidates).toEqual(['help']);
  });

  it('matches multiple commands sharing a prefix', () => {
    const { candidates } = getCompletions('c');
    // every real command starting with "c" — keeps this test honest if
    // COMMANDS ever changes instead of hardcoding a stale list
    const expected = COMMANDS.filter((c) => c.startsWith('c'));
    expect(candidates.sort()).toEqual(expected.sort());
  });

  it('returns no candidates for an unknown prefix', () => {
    const { candidates } = getCompletions('zzz');
    expect(candidates).toEqual([]);
  });

  it('replace() completes the command with a trailing space', () => {
    const { replace } = getCompletions('he');
    expect(replace('help')).toBe('help ');
  });

  it('completes the "open" argument against known social targets', () => {
    const { candidates, replace } = getCompletions('open git');
    expect(candidates).toContain('github');
    expect(replace('github')).toBe('open github ');
  });

  it('completes "cat" arguments against project slugs plus sobre.md', () => {
    const { candidates } = getCompletions('cat ');
    expect(candidates).toContain('sobre.md');
    expect(candidates.length).toBeGreaterThan(1);
  });

  it('narrows "cat" candidates as more of the slug is typed', () => {
    const { candidates: all } = getCompletions('cat ');
    const target = all.find((c) => c !== 'sobre.md');
    expect(target).toBeDefined();
    const prefix = target!.slice(0, 3);
    const { candidates: narrowed } = getCompletions(`cat ${prefix}`);
    expect(narrowed).toContain(target);
    expect(narrowed.length).toBeLessThanOrEqual(all.length);
  });
});

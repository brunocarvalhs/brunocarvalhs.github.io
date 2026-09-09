import { describe, expect, it } from 'vitest';
import { hashString, pickIcon, slugifyTitle } from './ProjectThumbnail';
import { Smartphone, Globe, Terminal as TerminalIcon, Wrench } from 'lucide-react';

describe('hashString', () => {
  it('is deterministic for the same input', () => {
    expect(hashString('Friends Secrets')).toBe(hashString('Friends Secrets'));
  });

  it('differs for different inputs (no trivial collisions for these titles)', () => {
    expect(hashString('Friends Secrets')).not.toBe(hashString('Paguei'));
  });

  it('is always non-negative', () => {
    expect(hashString('anything')).toBeGreaterThanOrEqual(0);
    expect(hashString('')).toBeGreaterThanOrEqual(0);
  });
});

describe('pickIcon', () => {
  it('picks Smartphone for Android/Kotlin/Jetpack stacks', () => {
    expect(pickIcon(['Kotlin', 'Android', 'Jetpack Compose'])).toBe(Smartphone);
  });

  it('picks the terminal icon for Node-ish stacks', () => {
    expect(pickIcon(['Node.js', 'Express', 'MongoDB'])).toBe(TerminalIcon);
  });

  it('picks Globe for frontend web stacks', () => {
    expect(pickIcon(['React', 'HTML5'])).toBe(Globe);
  });

  it('falls back to Wrench when nothing matches', () => {
    expect(pickIcon(['COBOL'])).toBe(Wrench);
  });

  it('is case-insensitive', () => {
    expect(pickIcon(['ANDROID'])).toBe(Smartphone);
  });
});

describe('slugifyTitle', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugifyTitle('Friends Secrets')).toBe('friends-secrets');
  });

  it('strips accents instead of dropping the letter (regression: Portfólio)', () => {
    expect(slugifyTitle('Portfólio Pessoal')).toBe('portfolio-pessoal');
  });

  it('strips punctuation like "!"', () => {
    expect(slugifyTitle('Paguei!')).toBe('paguei');
  });

  it('has no leading or trailing hyphens', () => {
    expect(slugifyTitle('  How-Much  ')).not.toMatch(/^-|-$/);
  });
});

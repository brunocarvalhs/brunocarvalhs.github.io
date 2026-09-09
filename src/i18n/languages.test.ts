import { describe, expect, it } from 'vitest';
import { detectBrowserLanguage } from './languages';

describe('detectBrowserLanguage', () => {
  it('matches English variants to "en"', () => {
    expect(detectBrowserLanguage(['en-US'])).toBe('en');
    expect(detectBrowserLanguage(['en-GB'])).toBe('en');
  });

  it('matches Spanish variants to "es"', () => {
    expect(detectBrowserLanguage(['es-AR'])).toBe('es');
    expect(detectBrowserLanguage(['es-ES'])).toBe('es');
  });

  it('matches any Portuguese variant to "pt-BR", including pt-PT', () => {
    expect(detectBrowserLanguage(['pt-BR'])).toBe('pt-BR');
    expect(detectBrowserLanguage(['pt-PT'])).toBe('pt-BR');
  });

  it('falls back to pt-BR for an unsupported language', () => {
    expect(detectBrowserLanguage(['fr-FR'])).toBe('pt-BR');
  });

  it('falls back to pt-BR for an empty candidate list', () => {
    expect(detectBrowserLanguage([])).toBe('pt-BR');
  });

  it('picks the first supported match, skipping unsupported candidates before it', () => {
    expect(detectBrowserLanguage(['fr-FR', 'de-DE', 'en-US'])).toBe('en');
  });
});

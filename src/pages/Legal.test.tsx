import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getQueryParam, updateQueryParam } from './Legal';

function setUrl(url: string) {
  window.history.pushState({}, '', url);
}

describe('getQueryParam', () => {
  afterEach(() => {
    setUrl('/legal');
  });

  it('reads a param from a normal query string', () => {
    setUrl('/legal?doc=cestou-privacy-policy');
    expect(getQueryParam('doc')).toBe('cestou-privacy-policy');
  });

  it('falls back to reading the param from inside the hash', () => {
    setUrl('/legal#/legal?doc=cestou-privacy-policy');
    expect(getQueryParam('doc')).toBe('cestou-privacy-policy');
  });

  it('prefers the real query string over the hash when both are present', () => {
    setUrl('/legal?doc=real#/legal?doc=hashed');
    expect(getQueryParam('doc')).toBe('real');
  });

  it('returns null when the param is absent from both', () => {
    setUrl('/legal');
    expect(getQueryParam('doc')).toBeNull();
  });
});

describe('updateQueryParam', () => {
  beforeEach(() => {
    setUrl('/legal');
  });

  it('sets the param in the URL query string', () => {
    updateQueryParam('doc', 'friends_secrets-terms-of-use');
    expect(window.location.search).toContain('doc=friends_secrets-terms-of-use');
  });

  it('removes the param when passed null', () => {
    updateQueryParam('doc', 'some-id');
    updateQueryParam('doc', null);
    expect(window.location.search).not.toContain('doc=');
  });

  it('keeps an existing hash path intact while updating its query params', () => {
    setUrl('/legal#/legal?doc=old');
    updateQueryParam('doc', 'new');
    expect(window.location.hash).toContain('doc=new');
    expect(window.location.hash).not.toContain('doc=old');
  });
});

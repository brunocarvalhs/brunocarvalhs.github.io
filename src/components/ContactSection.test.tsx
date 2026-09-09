import { describe, expect, it } from 'vitest';
import { buildMailtoUrl, CONTACT_EMAIL } from './ContactSection';

describe('buildMailtoUrl', () => {
  const formData = { name: 'Ana Recrutadora', email: 'ana@empresa.com', message: 'Oi, temos uma vaga.' };

  it('targets the real contact email', () => {
    expect(buildMailtoUrl(formData)).toMatch(new RegExp(`^mailto:${CONTACT_EMAIL}\\?`));
  });

  it('includes the sender name in the subject', () => {
    const url = buildMailtoUrl(formData);
    const subject = new URL(url.replace('mailto:', 'mailto://')).searchParams.get('subject');
    expect(subject).toContain('Ana Recrutadora');
  });

  it('includes the message, name and reply email in the body', () => {
    const url = buildMailtoUrl(formData);
    const body = new URL(url.replace('mailto:', 'mailto://')).searchParams.get('body');
    expect(body).toContain('Oi, temos uma vaga.');
    expect(body).toContain('Ana Recrutadora');
    expect(body).toContain('ana@empresa.com');
  });

  it('percent-encodes special characters so the mailto URL stays valid', () => {
    const url = buildMailtoUrl({ name: 'Foo & Bar', email: 'x@y.com', message: 'Line one\nLine two?' });
    expect(url).not.toContain('\n');
    expect(url).toContain('%0A');
  });
});

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import fs from 'node:fs';
import { decodeBase64Utf8, encodeBase64Utf8 } from '@/lib/admin';

vi.mock('@/lib/admin', async (orig) => ({ ...(await orig<object>()), GITHUB_CLIENT_ID: 'Iv-test' }));
import Admin from './Admin';

it('carrega, edita e salva', async () => {
  const pt = fs.readFileSync('src/data/portfolio.json', 'utf8');
  const calls: { url: string; init?: RequestInit }[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url, init });
    if (url.endsWith('/user')) return Response.json({ login: 'brunocarvalhs' });
    if (init?.method === 'PUT') return Response.json({ content: { sha: 'new' } });
    return Response.json({ content: encodeBase64Utf8(pt), sha: 'old' });
  }));
  sessionStorage.setItem('admin_token', 'tok');
  render(<Admin />);
  await screen.findByText('Conectado como brunocarvalhs');
  const save = screen.getByRole('button', { name: 'Salvar Português' }) as HTMLButtonElement;
  expect(save.disabled).toBe(true);
  const nameInput = screen.getAllByDisplayValue('Bruno Carvalho')[0];
  fireEvent.change(nameInput, { target: { value: 'Bruno C. Teste' } });
  expect(save.disabled).toBe(false);
  const before = calls.length;
  fireEvent.click(save);
  await screen.findByText(/Português salvo/);
  const put = calls.slice(before).find((c) => c.init?.method === 'PUT');
  const body = JSON.parse(put.init.body as string);
  expect(body.sha).toBe('old');
  expect(put.url).toContain('contents/src/data/portfolio.json');
  const saved = JSON.parse(decodeBase64Utf8(body.content));
  expect(saved.hero.name).toBe('Bruno C. Teste');
  expect(saved.projects).toEqual(JSON.parse(pt).projects);
  await waitFor(() => expect(save.disabled).toBe(true));
});

// Modo admin: login com GitHub e leitura/gravação dos portfolio*.json pela API
// de contents. Ver specs/008-admin-editor/spec.md.
import { Language } from '@/i18n/languages';

// Client ID do GitHub App (público, não é segredo). Vazio = admin desligado.
export const GITHUB_CLIENT_ID = '';

const REPO = 'brunocarvalhs/brunocarvalhs.github.io';
const BRANCH = 'master';
export const TOKEN_KEY = 'admin_token';
const STATE_KEY = 'admin_oauth_state';

export const CONTENT_FILES: Record<Language, string> = {
  'pt-BR': 'src/data/portfolio.json',
  en: 'src/data/portfolio.en.json',
  es: 'src/data/portfolio.es.json',
};

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export class GitHubError extends Error {
  constructor(public status: number) {
    super(`GitHub respondeu ${status}`);
  }
}

export function encodeBase64Utf8(text: string): string {
  let binary = '';
  new TextEncoder().encode(text).forEach((byte) => (binary += String.fromCharCode(byte)));
  return btoa(binary);
}

export function decodeBase64Utf8(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}

/** Mesma forma do valor, com tudo vazio: molde para um item novo de lista. */
export function emptyLike(value: Json): Json {
  if (Array.isArray(value)) return [];
  if (value === null) return null;
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, emptyLike(v)]));
  }
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return '';
}

/**
 * Lê o retorno do Worker no fragmento da URL (#token=… ou #error=…).
 * Recusa se o state não for o que esta aba gerou (proteção contra CSRF).
 */
export function readAuthFragment(
  hash: string,
  expectedState: string | null
): { token?: string; error?: string } | null {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (!params.has('token') && !params.has('error')) return null;
  if (!expectedState || params.get('state') !== expectedState) return { error: 'state_mismatch' };
  return params.has('token') ? { token: params.get('token') } : { error: params.get('error') };
}

/** Consome o retorno do login, se houver: guarda o token e limpa a URL. */
export function consumeAuthFragment(): { token?: string; error?: string } | null {
  const auth = readAuthFragment(window.location.hash, sessionStorage.getItem(STATE_KEY));
  if (!auth) return null;
  sessionStorage.removeItem(STATE_KEY);
  window.history.replaceState(null, '', window.location.pathname);
  if (auth.token) sessionStorage.setItem(TOKEN_KEY, auth.token);
  return auth;
}

export function startLogin() {
  const state = crypto.randomUUID();
  sessionStorage.setItem(STATE_KEY, state);
  const query = new URLSearchParams({ client_id: GITHUB_CLIENT_ID, state });
  window.location.href = `https://github.com/login/oauth/authorize?${query}`;
}

async function github(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new GitHubError(res.status);
  return res.json();
}

export async function getLogin(token: string): Promise<string> {
  return (await github(token, '/user')).login;
}

export async function loadFile(token: string, path: string): Promise<{ data: Json; sha: string }> {
  const file = await github(token, `/repos/${REPO}/contents/${path}?ref=${BRANCH}`);
  return { data: JSON.parse(decodeBase64Utf8(file.content)), sha: file.sha };
}

/** Grava um commit com o arquivo novo. O `sha` faz o GitHub recusar (409) se o arquivo mudou. */
export async function saveFile(token: string, path: string, data: Json, sha: string): Promise<string> {
  const result = await github(token, `/repos/${REPO}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message: `content: atualiza ${path} pelo /admin`,
      content: encodeBase64Utf8(JSON.stringify(data, null, 2) + '\n'),
      sha,
      branch: BRANCH,
    }),
  });
  return result.content.sha;
}

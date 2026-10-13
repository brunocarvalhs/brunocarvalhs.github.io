import { describe, expect, it } from 'vitest';
import { decodeBase64Utf8, emptyLike, encodeBase64Utf8, readAuthFragment } from './admin';

describe('base64 UTF-8', () => {
  it('ida e volta preserva acentos e emoji', () => {
    const text = 'Itaú, América Latina — usado por milhões 🚀';
    expect(decodeBase64Utf8(encodeBase64Utf8(text))).toBe(text);
  });

  it('decodifica o base64 quebrado em linhas que a API do GitHub devolve', () => {
    const encoded = encodeBase64Utf8('ação'.repeat(30));
    const wrapped = encoded.replace(/(.{60})/g, '$1\n');
    expect(decodeBase64Utf8(wrapped)).toBe('ação'.repeat(30));
  });
});

describe('emptyLike', () => {
  it('copia a forma de um projeto com os valores vazios', () => {
    const project = { title: 'Paguei!', technologies: ['Kotlin'], live: null, level: 90 };
    expect(emptyLike(project)).toEqual({ title: '', technologies: [], live: null, level: 0 });
  });
});

describe('readAuthFragment', () => {
  it('ignora URL sem retorno do login', () => {
    expect(readAuthFragment('', 's1')).toBeNull();
  });

  it('aceita o token quando o state confere', () => {
    expect(readAuthFragment('#token=tok&state=s1', 's1')).toEqual({ token: 'tok' });
  });

  it('recusa token com state diferente ou sem state guardado', () => {
    expect(readAuthFragment('#token=tok&state=outro', 's1')).toEqual({ error: 'state_mismatch' });
    expect(readAuthFragment('#token=tok&state=s1', null)).toEqual({ error: 'state_mismatch' });
  });

  it('repassa o erro do Worker', () => {
    expect(readAuthFragment('#error=forbidden&state=s1', 's1')).toEqual({ error: 'forbidden' });
  });
});

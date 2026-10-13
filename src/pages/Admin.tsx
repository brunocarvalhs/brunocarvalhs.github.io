import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Language, LANGUAGE_NAMES, SUPPORTED_LANGUAGES } from '@/i18n/languages';
import {
  CONTENT_FILES,
  GITHUB_CLIENT_ID,
  GitHubError,
  Json,
  TOKEN_KEY,
  consumeAuthFragment,
  emptyLike,
  getLogin,
  loadFile,
  saveFile,
  startLogin,
} from '@/lib/admin';

type Doc = { data: Json; sha: string; saved: string };

const LOGIN_ERRORS: Record<string, string> = {
  forbidden: 'Acesso negado: só a conta dona do site pode entrar.',
  login_failed: 'O GitHub não concluiu o login. Tente de novo.',
  state_mismatch: 'O retorno do login não veio desta aba. Tente de novo.',
};

function Labeled({ name, children }: { name: string; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm text-gray-600 dark:text-gray-400">{name}</span>
      {children}
    </label>
  );
}

/** Campo gerado a partir da forma do valor: texto, número, lista ou objeto. */
function Field({ name, value, onChange }: { name: string; value: Json; onChange: (v: Json) => void }) {
  if (Array.isArray(value)) {
    return (
      <fieldset className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
        <legend className="px-1 text-sm font-semibold">{name} ({value.length})</legend>
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <Field
                name={`${name} ${i + 1}`}
                value={item}
                onChange={(v) => onChange(value.map((old, j) => (j === i ? v : old)))}
              />
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange(value.filter((_, j) => j !== i))}>
              Remover
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          // ponytail: lista esvaziada perde o molde e o item novo vira texto; editar o JSON se precisar
          onClick={() => onChange([...value, value.length ? emptyLike(value[value.length - 1]) : ''])}
        >
          Adicionar
        </Button>
      </fieldset>
    );
  }
  if (value !== null && typeof value === 'object') {
    return (
      <fieldset className="space-y-3 rounded-lg border p-4 dark:border-gray-700">
        <legend className="px-1 text-sm font-semibold">{name}</legend>
        {Object.entries(value).map(([key, child]) => (
          <Field key={key} name={key} value={child} onChange={(v) => onChange({ ...value, [key]: v })} />
        ))}
      </fieldset>
    );
  }
  if (typeof value === 'number') {
    return (
      <Labeled name={name}>
        <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
      </Labeled>
    );
  }
  if (typeof value === 'boolean') {
    return (
      <Labeled name={name}>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      </Labeled>
    );
  }
  const TextField = /description|quote/i.test(name) ? Textarea : Input;
  return (
    <Labeled name={name}>
      <TextField value={(value as string | null) ?? ''} onChange={(e) => onChange(e.target.value)} />
    </Labeled>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [login, setLogin] = useState<string | null>(null);
  const [docs, setDocs] = useState<Partial<Record<Language, Doc>>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setDocs({});
  };

  const showError = (error: unknown) => {
    if (error instanceof GitHubError && error.status === 401) {
      logout();
      setMessage('Sua sessão expirou. Entre de novo.');
    } else if (error instanceof GitHubError && error.status === 409) {
      setMessage('O arquivo mudou no GitHub depois de carregado. Recarregue a página antes de salvar.');
    } else {
      setMessage(`Não deu certo: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  useEffect(() => {
    const auth = consumeAuthFragment();
    if (auth?.token) setToken(auth.token);
    if (auth?.error) setMessage(LOGIN_ERRORS[auth.error] ?? 'Não foi possível entrar.');
  }, []);

  useEffect(() => {
    if (!token) return;
    Promise.all([getLogin(token), ...SUPPORTED_LANGUAGES.map((lang) => loadFile(token, CONTENT_FILES[lang]))])
      .then(([user, ...files]) => {
        setLogin(user as string);
        setDocs(
          Object.fromEntries(
            SUPPORTED_LANGUAGES.map((lang, i) => {
              const file = files[i] as { data: Json; sha: string };
              return [lang, { ...file, saved: JSON.stringify(file.data) }];
            })
          )
        );
      })
      .catch(showError);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const save = async (lang: Language) => {
    const doc = docs[lang];
    setSaving(true);
    setMessage(null);
    try {
      const sha = await saveFile(token, CONTENT_FILES[lang], doc.data, doc.sha);
      setDocs((d) => ({ ...d, [lang]: { ...doc, sha, saved: JSON.stringify(doc.data) } }));
      setMessage(`${LANGUAGE_NAMES[lang]} salvo. O site atualiza em 1 a 2 minutos.`);
    } catch (error) {
      showError(error);
    } finally {
      setSaving(false);
    }
  };

  let body: ReactNode;
  if (!GITHUB_CLIENT_ID) {
    body = <p>O admin ainda não foi configurado. Veja specs/008-admin-editor/spec.md.</p>;
  } else if (!token) {
    body = <Button onClick={startLogin}>Entrar com GitHub</Button>;
  } else if (!docs['pt-BR']) {
    body = <p>Carregando o conteúdo…</p>;
  } else {
    body = (
      <>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Conectado como {login}</p>
          <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
        </div>
        <Tabs defaultValue="pt-BR">
          <TabsList>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <TabsTrigger key={lang} value={lang}>
                {LANGUAGE_NAMES[lang]}
                {JSON.stringify(docs[lang].data) !== docs[lang].saved && ' •'}
              </TabsTrigger>
            ))}
          </TabsList>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <TabsContent key={lang} value={lang} className="space-y-4">
              <Button
                disabled={saving || JSON.stringify(docs[lang].data) === docs[lang].saved}
                onClick={() => save(lang)}
              >
                {saving ? 'Salvando…' : `Salvar ${LANGUAGE_NAMES[lang]}`}
              </Button>
              {Object.entries(docs[lang].data as Record<string, Json>).map(([key, value]) => (
                <Field
                  key={key}
                  name={key}
                  value={value}
                  onChange={(v) =>
                    setDocs((d) => ({
                      ...d,
                      [lang]: { ...d[lang], data: { ...(d[lang].data as Record<string, Json>), [key]: v } },
                    }))
                  }
                />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 pt-24 dark:bg-gray-900">
      <div className="container mx-auto max-w-4xl space-y-6 px-4 sm:px-6">
        <h1 className="text-2xl font-bold">Admin</h1>
        {message && <p role="status" className="rounded-md bg-gray-100 p-3 text-sm dark:bg-gray-800">{message}</p>}
        {body}
      </div>
    </div>
  );
}

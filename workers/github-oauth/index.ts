// Troca o `code` do login com GitHub pelo token do usuário, mas só entrega o
// token se a conta for ALLOWED_LOGIN. Fica fora do GitHub Pages porque a troca
// exige o client_secret, que não pode ir para o navegador.
// Ver specs/008-admin-editor/spec.md.

export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  ALLOWED_LOGIN: string;
  SITE_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const params = new URL(request.url).searchParams;
    const code = params.get("code");
    const state = params.get("state") ?? "";
    if (!code) return new Response("missing code", { status: 400 });

    const back = (fragment: Record<string, string>) => {
      const url = new URL("/admin", env.SITE_URL);
      url.hash = new URLSearchParams({ ...fragment, state }).toString();
      return Response.redirect(url.toString(), 302);
    };

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const { access_token: token } = (await tokenRes.json()) as { access_token?: string };
    if (!token) return back({ error: "login_failed" });

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "brunocarvalhs-admin",
      },
    });
    const { login } = (await userRes.json()) as { login?: string };
    if (!login || login.toLowerCase() !== env.ALLOWED_LOGIN.toLowerCase()) {
      return back({ error: "forbidden" });
    }

    return back({ token });
  },
};

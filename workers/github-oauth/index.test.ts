// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import worker, { Env } from "./index";

const env: Env = {
  GITHUB_CLIENT_ID: "id",
  GITHUB_CLIENT_SECRET: "secret",
  ALLOWED_LOGIN: "brunocarvalhs",
  SITE_URL: "https://brunocarvalhs.github.io",
};

function mockGitHub(token: string | undefined, login: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) =>
      Response.json(url.includes("access_token") ? { access_token: token } : { login })
    )
  );
}

async function callback(query: string) {
  const res = await worker.fetch(new Request(`https://worker.dev/?${query}`), env);
  const location = res.headers.get("Location") ?? "";
  return { res, fragment: new URLSearchParams(location.split("#")[1] ?? "") , location };
}

afterEach(() => vi.unstubAllGlobals());

describe("github-oauth worker", () => {
  it("devolve o token para a conta permitida, com o state", async () => {
    mockGitHub("tok", "BrunoCarvalhs");
    const { location, fragment } = await callback("code=c&state=s1");
    expect(location.startsWith("https://brunocarvalhs.github.io/admin#")).toBe(true);
    expect(fragment.get("token")).toBe("tok");
    expect(fragment.get("state")).toBe("s1");
  });

  it("não entrega token para outra conta", async () => {
    mockGitHub("tok", "outra-pessoa");
    const { location, fragment } = await callback("code=c&state=s1");
    expect(fragment.get("error")).toBe("forbidden");
    expect(location).not.toContain("tok");
  });

  it("avisa quando a troca do code falha", async () => {
    mockGitHub(undefined, "brunocarvalhs");
    const { fragment } = await callback("code=c&state=s1");
    expect(fragment.get("error")).toBe("login_failed");
  });

  it("recusa chamada sem code", async () => {
    const { res } = await callback("state=s1");
    expect(res.status).toBe(400);
  });
});

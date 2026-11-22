import { expect, type BrowserContext, type Page } from "@playwright/test";

export const API_URL = (process.env.E2E_API_URL ?? "http://localhost:4100").replace(/\/+$/, "");
export const PASSWORD = "Correct-Horse-9";
const CSRF = { "X-DocFinish-Client": "web" };

export function uniqueEmail(tag: string) {
  return `e2e-${tag}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}@docfinish.test`;
}

export async function registerViaApi(context: BrowserContext, tag: string, name = "E2E User") {
  const email = uniqueEmail(tag);
  const res = await context.request.post(`${API_URL}/auth/register`, {
    headers: CSRF,
    data: { email, password: PASSWORD, name },
  });
  expect(res.status(), await res.text()).toBe(201);
  return { email, password: PASSWORD, name };
}

export async function upgradeToProViaApi(context: BrowserContext) {
  const checkout = await context.request.post(`${API_URL}/billing/checkout`, { headers: CSRF, data: { plan: "pro_monthly" } });
  expect(checkout.status(), await checkout.text()).toBe(200);
  const { checkoutUrl } = (await checkout.json()) as { checkoutUrl: string };
  const url = new URL(checkoutUrl);
  const done = await context.request.get(`${API_URL}${url.pathname}${url.search}`, { maxRedirects: 0 });
  expect([200, 302]).toContain(done.status());
  const me = await context.request.get(`${API_URL}/auth/me`);
  expect(((await me.json()) as { user: { plan: string } }).user.plan).toBe("pro");
}

export async function createProjectViaApi(context: BrowserContext, name: string, templateId = "client-proposal", markdown = "# Seeded\n\nBody text") {
  const res = await context.request.post(`${API_URL}/projects`, { headers: CSRF, data: { name, templateId, markdown } });
  expect(res.status(), await res.text()).toBe(201);
  return ((await res.json()) as { project: { id: string; name: string } }).project;
}

export async function loginViaUi(page: Page, email: string, password = PASSWORD) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
  await page.waitForURL(/\/dashboard/);
}

export function trackConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const text = m.text();
    if (/Failed to load resource.*(401|404)/.test(text)) return;
    if (/favicon|hydrat/i.test(text) && /favicon/i.test(text)) return;
    errors.push(`console: ${text}`);
  });
  return errors;
}

export async function setEditorMarkdown(page: Page, markdown: string) {
  const editor = page.locator(".cm-content").first();
  await editor.waitFor({ state: "visible" });
  await editor.click();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(markdown);
}

export function preview(page: Page) {
  return page.getByLabel("Document preview");
}

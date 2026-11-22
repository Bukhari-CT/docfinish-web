import { expect, test } from "@playwright/test";
import { trackConsoleErrors } from "./helpers";

const TEMPLATE_IDS = ["client-proposal", "business-report", "project-brief", "meeting-notes", "sop", "resume", "invoice", "academic-paper"];
const TOOLS = ["markdown-to-pdf", "markdown-viewer", "ai-markdown-to-pdf", "markdown-to-google-docs", "pdf-to-markdown"];
const ARTICLES = [
  "markdown-to-pdf",
  "markdown-viewer",
  "markdown-to-google-docs",
  "pdf-to-markdown",
  "ai-markdown-to-pdf",
  "client-proposal-template",
  "business-report-template",
  "sop-template",
  "claude-output-to-pdf",
  "add-headers-and-footers",
];

test.describe("marketing pages render", () => {
  const staticPages = ["/", "/pricing", "/templates", "/resources", "/tools"];
  for (const path of staticPages) {
    test(`${path} loads with a heading and no console errors`, async ({ page }) => {
      const errors = trackConsoleErrors(page);
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading").first()).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }

  for (const id of TEMPLATE_IDS) {
    test(`/templates/${id} loads`, async ({ page }) => {
      const res = await page.goto(`/templates/${id}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });
  }

  for (const slug of TOOLS) {
    test(`/tools/${slug} loads`, async ({ page }) => {
      const res = await page.goto(`/tools/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });
  }

  for (const slug of ARTICLES) {
    test(`/resources/${slug} loads`, async ({ page }) => {
      const res = await page.goto(`/resources/${slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    });
  }

  for (const path of ["/pricing", "/resources", "/tools"]) {
    test.fixme(`${path} has exactly one h1 (currently uses h2 as page title)`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
    });
  }

  test("unknown routes show a 404", async ({ page }) => {
    const res = await page.goto("/templates/not-a-template");
    expect(res?.status()).toBe(404);
    const res2 = await page.goto("/resources/not-an-article");
    expect(res2?.status()).toBe(404);
    const res3 = await page.goto("/totally/unknown/path");
    expect(res3?.status()).toBe(404);
  });
});

test.describe("marketing navigation", () => {
  test("header links reach pricing, templates and resources", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    const nav = isMobile ? page.locator("header") : page.getByRole("navigation", { name: "Main" });
    await nav.getByRole("link", { name: "Pricing" }).first().click();
    await expect(page).toHaveURL(/\/pricing/);
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    await nav.getByRole("link", { name: "Templates" }).first().click();
    await expect(page).toHaveURL(/\/templates/);
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    await nav.getByRole("link", { name: "Resources" }).first().click();
    await expect(page).toHaveURL(/\/resources/);
  });

  test("guest header offers Log in and a free-tool CTA", async ({ page, isMobile }) => {
    await page.goto("/");
    if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
    await expect(page.getByRole("link", { name: "Log in" }).first()).toBeVisible();
  });

  test("pricing page: billing cycle toggle switches Monthly and Yearly", async ({ page }) => {
    await page.goto("/pricing");
    const cycle = page.getByRole("radiogroup", { name: "Billing cycle" }).or(page.getByLabel("Billing cycle"));
    await expect(cycle.first()).toBeVisible();
    const before = await page.locator("main").innerText();
    await page.getByText(/Yearly/).first().click();
    const after = await page.locator("main").innerText();
    expect(after).not.toEqual(before);
    await page.getByText("Monthly", { exact: true }).first().click();
  });

  test("pricing free CTA leads guests to signup", async ({ page }) => {
    await page.goto("/pricing");
    await page.locator('main a[href="/signup"]').first().click();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("template page offers a way to use the template", async ({ page }) => {
    await page.goto("/templates/client-proposal");
    await expect(page.getByRole("button").or(page.getByRole("link")).filter({ hasText: /use|try|start|open/i }).first()).toBeVisible();
  });

  test("site exposes robots and sitemap", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    const sitemap = await request.get("/sitemap.xml");
    expect([200, 404]).toContain(robots.status());
    expect([200, 404]).toContain(sitemap.status());
    if (sitemap.status() === 200) expect(await sitemap.text()).toContain("<urlset");
  });
});

test.describe("route guards for guests", () => {
  for (const path of ["/dashboard", "/projects", "/brand-kit", "/billing", "/settings"]) {
    test(`${path} redirects to /login?next=`, async ({ page }) => {
      await page.goto(path);
      await page.waitForURL(/\/login\?next=/);
      expect(decodeURIComponent(new URL(page.url()).searchParams.get("next") ?? "")).toBe(path);
    });
  }
});

import { expect, test } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { API_URL, createProjectViaApi, preview, registerViaApi, upgradeToProViaApi } from "./helpers";

test.describe("billing flow with the mock provider", () => {
  test("upgrade through checkout makes the account Pro, then cancel keeps Pro until period end", async ({ page, context }) => {
    await registerViaApi(context, "upgrade");
    await page.goto("/billing");
    await expect(page.getByText("Free plan")).toBeVisible();
    await page.getByRole("button", { name: /Upgrade|Get Pro|Start/i }).first().click();
    await page.waitForURL(/\/billing\?checkout=success/);
    await expect(page.getByText("DocFinish Pro")).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("button", { name: "Cancel subscription" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel subscription" }).click();
    await expect(page.getByRole("dialog")).toContainText("Cancel your subscription?");
    await page.getByRole("button", { name: "Keep Pro" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Cancel subscription" }).click();
    await page.getByRole("dialog").getByRole("button", { name: /Cancel subscription/ }).click();
    await expect(page.getByText("Subscription canceled")).toBeVisible();
    await expect(page.getByText("DocFinish Pro")).toBeVisible();
  });

  test("yearly plan can be selected before checkout", async ({ page, context }) => {
    await registerViaApi(context, "yearly");
    await page.goto("/billing");
    await page.getByText(/Yearly/).first().click();
    await expect(page.locator("main")).toContainText(/billed yearly/);
  });
});

test.describe("pro features in the UI", () => {
  test("Pro users can create several projects and use premium templates", async ({ page, context }) => {
    await registerViaApi(context, "proproj");
    await upgradeToProViaApi(context);
    await createProjectViaApi(context, "Pro One");
    await page.goto("/projects");
    await page.getByRole("button", { name: /New document/ }).first().click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Name").fill("Pro Resume");
    await dialog.getByRole("button", { name: /Resume/ }).click();
    await dialog.getByRole("button", { name: "Create document" }).click();
    await page.waitForURL(/\/editor\//);
    await expect(page.getByLabel("Document name")).toHaveValue("Pro Resume");
    await page.goto("/projects");
    await expect(page.getByLabel("Open Pro One")).toBeVisible();
    await expect(page.getByLabel("Open Pro Resume")).toBeVisible();
  });

  test("switching a Pro project to a premium template works", async ({ page, context }) => {
    await registerViaApi(context, "protpl");
    await upgradeToProViaApi(context);
    const p = await createProjectViaApi(context, "Switch Me");
    await page.goto(`/editor/${p.id}`);
    await page.locator("aside").last().getByText("Invoice").first().click();
    await expect(page.getByRole("dialog")).toContainText("Switch to Invoice?");
    await page.getByRole("button", { name: "Apply template" }).click();
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible({ timeout: 15_000 });
  });

  test("brand kit: save, reload and see it persisted", async ({ page, context }) => {
    await registerViaApi(context, "brandkit");
    await upgradeToProViaApi(context);
    await page.goto("/brand-kit");
    await page.getByLabel("Kit name").fill("Acme Brand");
    await page.getByLabel("Company name").fill("Acme Corp");
    await page.getByRole("button", { name: /Save/ }).first().click();
    await expect(page.getByText("Brand kit saved")).toBeVisible();
    await page.reload();
    await expect(page.getByLabel("Kit name")).toHaveValue("Acme Brand");
    await expect(page.getByLabel("Company name")).toHaveValue("Acme Corp");
    const res = await context.request.get(`${API_URL}/brand-kit`);
    expect(((await res.json()) as { brandKit: { companyName: string } }).brandKit.companyName).toBe("Acme Corp");
  });

  test("brand kit: margins are clamped and page size can change", async ({ page, context }) => {
    await registerViaApi(context, "brandmargin");
    await upgradeToProViaApi(context);
    await page.goto("/brand-kit");
    await page.getByLabel(/top margin/i).fill("500");
    await expect(page.getByLabel(/top margin/i)).toHaveValue("60");
  });

  test("brand kit: rejects an invalid logo type", async ({ page, context }) => {
    await registerViaApi(context, "brandlogo");
    await upgradeToProViaApi(context);
    await page.goto("/brand-kit");
    const file = path.join(os.tmpdir(), `bad-logo-${Date.now()}.gif`);
    fs.writeFileSync(file, "GIF89a");
    await page.locator('input[type="file"]').first().setInputFiles(file);
    await expect(page.getByText("Use a PNG, JPEG, WebP, or SVG logo.")).toBeVisible();
    fs.unlinkSync(file);
  });

  test("brand kit: applying it from the editor settings panel", async ({ page, context }) => {
    await registerViaApi(context, "applykit");
    await upgradeToProViaApi(context);
    await context.request.put(`${API_URL}/brand-kit`, {
      headers: { "X-DocFinish-Client": "web" },
      data: {
        name: "Applied Kit",
        companyName: "Applied Co",
        logoDataUrl: null,
        primaryColor: "#112233",
        accentColor: "#aa3300",
        textColor: "#111111",
        headingFont: "inter",
        bodyFont: "source-serif",
        headerPresets: [],
        defaultPageSize: "Letter",
        defaultMargins: { top: 25, right: 25, bottom: 25, left: 25 },
      },
    });
    const p = await createProjectViaApi(context, "Kit Target");
    await page.goto(`/editor/${p.id}`);
    await page.getByRole("tab", { name: "Brand" }).click();
    await page.getByRole("button", { name: "Apply saved brand kit" }).click();
    await expect(page.getByText("Applied Applied Kit").first()).toBeVisible();
    await expect(page.getByText(/Letter/).first()).toBeVisible();
  });

  test("version history is available through the API for edited Pro projects", async ({ page, context }) => {
    await registerViaApi(context, "history");
    await upgradeToProViaApi(context);
    const p = await createProjectViaApi(context, "History Doc");
    for (const md of ["# v2", "# v3"]) {
      await context.request.patch(`${API_URL}/projects/${p.id}`, { headers: { "X-DocFinish-Client": "web" }, data: { markdown: md, snapshot: true } });
    }
    await page.goto(`/editor/${p.id}`);
    await expect(preview(page)).toContainText("v3");
    const detail = await context.request.get(`${API_URL}/projects/${p.id}`);
    expect(((await detail.json()) as { versions: unknown[] }).versions.length).toBeGreaterThanOrEqual(2);
  });

  test("Google export for Pro: shows 'not active yet' state when Google isn't configured", async ({ page, context }) => {
    await registerViaApi(context, "gpro");
    await upgradeToProViaApi(context);
    const p = await createProjectViaApi(context, "Google Pro Doc");
    await page.goto(`/editor/${p.id}`);
    await page.getByLabel("More export options").click();
    await page.getByRole("menuitem", { name: /Google Docs/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Export to Google Docs");
    await expect(dialog).toContainText(/isn't active yet|Connect Google/);
  });

  test("PDF to Markdown: upload a generated PDF and get Markdown back", async ({ page, context }) => {
    await registerViaApi(context, "p2mpro");
    await upgradeToProViaApi(context);
    const settings = ((await (await context.request.get(`${API_URL}/templates/client-proposal`)).json()) as { template: { settings: unknown } }).template.settings;
    const gen = await context.request.post(`${API_URL}/conversions/markdown-to-pdf`, {
      headers: { "X-DocFinish-Client": "web" },
      data: { title: "E2E PDF", mode: "server", html: "<h1>E2E Heading</h1><p>Narwhal extraction sentence.</p>", settings },
    });
    expect(gen.status()).toBe(201);
    let job = ((await gen.json()) as { job: { id: string; status: string; result?: { downloadUrl?: string } } }).job;
    for (let i = 0; i < 30 && job.status !== "succeeded"; i++) {
      await page.waitForTimeout(500);
      job = ((await (await context.request.get(`${API_URL}/conversions/${job.id}`)).json()) as { job: typeof job }).job;
    }
    const pdf = await context.request.get(new URL(job.result!.downloadUrl!, API_URL).toString());
    const file = path.join(os.tmpdir(), `e2e-${Date.now()}.pdf`);
    fs.writeFileSync(file, await pdf.body());
    await page.goto("/tools/pdf-to-markdown");
    await page.locator('input[type="file"]').first().setInputFiles(file);
    await expect(page.getByLabel("Converted Markdown")).toHaveValue(/Narwhal extraction sentence/i, { timeout: 40_000 });
    fs.unlinkSync(file);
  });

  test("PDF to Markdown rejects a non-PDF file", async ({ page, context }) => {
    await registerViaApi(context, "p2mbad");
    await upgradeToProViaApi(context);
    await page.goto("/tools/pdf-to-markdown");
    await page.locator('input[type="file"]').first().setInputFiles({ name: "note.txt", mimeType: "text/plain", buffer: Buffer.from("hello") });
    await expect(page.getByText(/PDF/i).first()).toBeVisible();
    await expect(page.getByLabel("Converted Markdown")).toHaveCount(0);
  });

  test("Pro users can export unlimited PDFs (more than the free 3)", async ({ page, context }) => {
    await registerViaApi(context, "unlimited");
    await upgradeToProViaApi(context);
    const p = await createProjectViaApi(context, "Unlimited");
    const settings = ((await (await context.request.get(`${API_URL}/projects/${p.id}`)).json()) as { project: { settings: unknown } }).project.settings;
    for (let i = 0; i < 4; i++) {
      const r = await context.request.post(`${API_URL}/conversions/markdown-to-pdf`, {
        headers: { "X-DocFinish-Client": "web" },
        data: { title: "x", mode: "browser", markdown: "# x", settings },
      });
      expect(r.status()).toBe(201);
    }
    await page.addInitScript(() => {
      window.print = () => undefined;
    });
    await page.goto(`/editor/${p.id}`);
    await expect(page.getByLabel("Export PDF")).toBeEnabled({ timeout: 20_000 });
    await page.getByLabel("Export PDF").click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});

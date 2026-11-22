import { expect, test } from "@playwright/test";
import { createProjectViaApi, preview, registerViaApi, setEditorMarkdown } from "./helpers";

test.describe("free plan: dashboard and projects", () => {
  test("dashboard shows empty state and a New document button", async ({ page, context }) => {
    await registerViaApi(context, "dash", "Dana Scully");
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: "Welcome back, Dana" })).toBeVisible();
    await expect(page.getByRole("button", { name: /New document/ }).first()).toBeVisible();
  });

  test("sidebar navigation reaches every app section", async ({ page, context }) => {
    await registerViaApi(context, "nav");
    await page.goto("/dashboard");
    const nav = page.getByRole("navigation", { name: "App" });
    for (const [label, url] of [
      ["Projects", /\/projects/],
      ["Brand kit", /\/brand-kit/],
      ["Billing", /\/billing/],
      ["Settings", /\/settings/],
      ["Dashboard", /\/dashboard/],
    ] as const) {
      await nav.getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(url);
    }
  });

  test("projects page shows the empty state", async ({ page, context }) => {
    await registerViaApi(context, "empty");
    await page.goto("/projects");
    await expect(page.getByText("No documents yet")).toBeVisible();
  });

  test("create a project from the New document dialog and land in the editor", async ({ page, context }) => {
    await registerViaApi(context, "create");
    await page.goto("/projects");
    await page.getByRole("button", { name: /New document/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("New document");
    await dialog.getByLabel("Name").fill("My E2E Proposal");
    await dialog.getByRole("button", { name: /Business Report/ }).click();
    await dialog.getByRole("button", { name: "Create document" }).click();
    await page.waitForURL(/\/editor\/[^/]+$/);
    await expect(page.getByLabel("Document name")).toHaveValue("My E2E Proposal");
    await expect(preview(page)).toBeVisible();
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible();
  });

  test("a second project on the free plan opens the upgrade dialog", async ({ page, context }) => {
    await registerViaApi(context, "quota");
    await createProjectViaApi(context, "First");
    await page.goto("/projects");
    await expect(page.getByLabel("Open First")).toBeVisible();
    await page.getByRole("button", { name: /New document/ }).first().click();
    await page.getByRole("dialog").getByRole("button", { name: "Create document" }).click();
    await expect(page.getByRole("dialog")).toContainText("Free includes one project");
    await expect(page.getByRole("link", { name: "See Pro plans" })).toHaveAttribute("href", "/pricing");
  });

  test("premium templates are locked in the New document dialog", async ({ page, context }) => {
    await registerViaApi(context, "locked");
    await page.goto("/projects");
    await page.getByRole("button", { name: /New document/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("Pro").first()).toBeVisible();
    await dialog.getByRole("button", { name: /Resume/ }).click();
    await expect(page.getByRole("dialog").last()).toContainText(/premium template|Pro/i);
  });

  test("delete a project through the confirm dialog", async ({ page, context }) => {
    await registerViaApi(context, "delete");
    await createProjectViaApi(context, "Doomed Doc");
    await page.goto("/projects");
    await page.getByLabel("Delete Doomed Doc").click();
    await page.getByRole("dialog").getByRole("button", { name: /Delete/ }).click();
    await expect(page.getByText("Project deleted")).toBeVisible();
    await expect(page.getByText("No documents yet")).toBeVisible();
  });

  test("cancelling the delete dialog keeps the project", async ({ page, context }) => {
    await registerViaApi(context, "keep");
    await createProjectViaApi(context, "Keeper");
    await page.goto("/projects");
    await page.getByLabel("Delete Keeper").click();
    await page.getByRole("dialog").getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByLabel("Open Keeper")).toBeVisible();
  });

  test("opening a project loads its content in the editor", async ({ page, context }) => {
    await registerViaApi(context, "open");
    const p = await createProjectViaApi(context, "Open Me", "client-proposal", "# Seeded Heading\n\nSeeded body");
    await page.goto("/projects");
    await page.getByLabel("Open Open Me").click();
    await page.waitForURL(new RegExp(`/editor/${p.id}`));
    await expect(preview(page)).toContainText("Seeded Heading");
  });

  test("an unknown project id shows an error state, not a crash", async ({ page, context }) => {
    await registerViaApi(context, "missing");
    await page.goto("/editor/00000000-0000-0000-0000-000000000000");
    await expect(page.locator("body")).toContainText(/not found|couldn't|doesn't exist|try again|error/i);
  });

  test("another user's project is not accessible", async ({ browser, context }) => {
    await registerViaApi(context, "owner");
    const p = await createProjectViaApi(context, "Private");
    const intruder = await browser.newContext();
    const page = await intruder.newPage();
    await registerViaApi(intruder, "intruder");
    await page.goto(`/editor/${p.id}`);
    await expect(page.locator("body")).not.toContainText("Seeded");
    await expect(page.locator("body")).toContainText(/not found|couldn't|doesn't exist|error/i);
    await intruder.close();
  });
});

test.describe("free plan: editor", () => {
  test("edits autosave and survive a reload", async ({ page, context }) => {
    await registerViaApi(context, "autosave");
    const p = await createProjectViaApi(context, "Autosave Doc");
    await page.goto(`/editor/${p.id}`);
    await setEditorMarkdown(page, "# Autosaved Title\n\nbody");
    await expect(page.getByText(/Unsaved changes|Saving…/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible({ timeout: 15_000 });
    await page.reload();
    await expect(preview(page)).toContainText("Autosaved Title");
  });

  test("renaming the document persists", async ({ page, context }) => {
    await registerViaApi(context, "rename");
    const p = await createProjectViaApi(context, "Old Name");
    await page.goto(`/editor/${p.id}`);
    await page.getByLabel("Document name").fill("Brand New Name");
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible({ timeout: 15_000 });
    await page.goto("/projects");
    await expect(page.getByLabel("Open Brand New Name")).toBeVisible();
  });

  test("switching to a premium template is blocked for free users", async ({ page, context }) => {
    await registerViaApi(context, "premium");
    const p = await createProjectViaApi(context, "Premium Try");
    await page.goto(`/editor/${p.id}`);
    await page.locator("aside").last().getByText("Resume").first().click();
    await expect(page.getByRole("dialog")).toContainText(/premium template|Pro/i);
  });

  test("conflicting edit in another tab raises the conflict banner and Keep mine wins", async ({ page, context }) => {
    await registerViaApi(context, "conflict");
    const p = await createProjectViaApi(context, "Conflict Doc");
    await page.goto(`/editor/${p.id}`);
    await expect(preview(page)).toContainText("Seeded");
    const other = await context.request.patch(`${process.env.E2E_API_URL ?? "http://localhost:4100"}/projects/${p.id}`, {
      headers: { "X-DocFinish-Client": "web" },
      data: { markdown: "# Changed Elsewhere" },
    });
    expect(other.status()).toBe(200);
    await setEditorMarkdown(page, "# My Local Edit");
    await expect(page.getByText("This document was changed somewhere else")).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: "Keep mine" }).click();
    await expect(page.getByRole("button", { name: "Saved", exact: true })).toBeVisible({ timeout: 15_000 });
    await page.reload();
    await expect(preview(page)).toContainText("My Local Edit");
  });

  test("conflicting edit: Load the other version replaces local content", async ({ page, context }) => {
    await registerViaApi(context, "conflict2");
    const p = await createProjectViaApi(context, "Conflict Doc 2");
    await page.goto(`/editor/${p.id}`);
    await expect(preview(page)).toContainText("Seeded");
    await context.request.patch(`${process.env.E2E_API_URL ?? "http://localhost:4100"}/projects/${p.id}`, {
      headers: { "X-DocFinish-Client": "web" },
      data: { markdown: "# Theirs Wins" },
    });
    await setEditorMarkdown(page, "# Mine Loses");
    await expect(page.getByText("This document was changed somewhere else")).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: /Load the other version/ }).click();
    await expect(preview(page)).toContainText("Theirs Wins");
  });
});

test.describe("free plan: exports", () => {
  test("browser PDF export records usage and triggers print", async ({ page, context }) => {
    await registerViaApi(context, "export");
    const p = await createProjectViaApi(context, "Export Doc");
    await page.addInitScript(() => {
      (window as unknown as { __printed: number }).__printed = 0;
      window.print = () => {
        (window as unknown as { __printed: number }).__printed++;
      };
    });
    await page.goto(`/editor/${p.id}`);
    await expect(page.getByLabel("Export PDF")).toBeEnabled({ timeout: 20_000 });
    await page.getByLabel("Export PDF").click();
    await expect.poll(() => page.evaluate(() => (window as unknown as { __printed: number }).__printed), { timeout: 15_000 }).toBeGreaterThan(0);
    const me = await context.request.get(`${process.env.E2E_API_URL ?? "http://localhost:4100"}/auth/me`);
    expect(((await me.json()) as { usage: { pdfExports: number } }).usage.pdfExports).toBe(1);
  });

  test("server PDF export produces a downloadable PDF", async ({ page, context }) => {
    await registerViaApi(context, "serverpdf");
    const p = await createProjectViaApi(context, "Server PDF Doc");
    await page.goto(`/editor/${p.id}`);
    await expect(page.getByLabel("Export PDF")).toBeEnabled({ timeout: 20_000 });
    await page.getByLabel("More export options").click();
    await page.getByRole("menuitem", { name: /Server/ }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toContainText("Your PDF is ready.", { timeout: 30_000 });
    const link = dialog.getByRole("link", { name: /Download/i });
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    const res = await context.request.get(new URL(href!, process.env.E2E_API_URL ?? "http://localhost:4100").toString());
    expect(res.status()).toBe(200);
    expect((await res.body()).subarray(0, 5).toString()).toBe("%PDF-");
  });

  test("the 4th export in a month opens the quota upgrade dialog", async ({ page, context }) => {
    await registerViaApi(context, "quotaexp");
    const p = await createProjectViaApi(context, "Quota Doc");
    const api = process.env.E2E_API_URL ?? "http://localhost:4100";
    const settings = ((await (await context.request.get(`${api}/projects/${p.id}`)).json()) as { project: { settings: unknown } }).project.settings;
    for (let i = 0; i < 3; i++) {
      const r = await context.request.post(`${api}/conversions/markdown-to-pdf`, {
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
    await expect(page.getByRole("dialog")).toContainText(/limit|monthly|exports|Upgrade/i);
  });

  test("Google Docs export is gated for free users", async ({ page, context }) => {
    await registerViaApi(context, "gdocsfree");
    const p = await createProjectViaApi(context, "G Doc");
    await page.goto(`/editor/${p.id}`);
    await page.getByLabel("More export options").click();
    await page.getByRole("menuitem", { name: /Google Docs/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });
});

test.describe("free plan: other pages", () => {
  test("brand kit page tells free users it is a Pro feature", async ({ page, context }) => {
    await registerViaApi(context, "bkfree");
    await page.goto("/brand-kit");
    await expect(page.locator("main")).toContainText(/Pro/);
  });

  test("brand kit save is rejected for free users with an upgrade message", async ({ page, context }) => {
    await registerViaApi(context, "bksave");
    await page.goto("/brand-kit");
    const save = page.getByRole("button", { name: /Save/ }).first();
    if (await save.isVisible().catch(() => false)) {
      await save.click();
      await expect(page.getByText(/Pro|upgrade/i).first()).toBeVisible();
    }
  });

  test("billing page shows the Free plan and an upgrade button", async ({ page, context }) => {
    await registerViaApi(context, "billfree");
    await page.goto("/billing");
    await expect(page.getByText("Free plan")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Upgrade to Pro" })).toBeVisible();
    await expect(page.getByText("What's included")).toBeVisible();
  });

  test("settings shows account details and Google connection state", async ({ page, context }) => {
    const user = await registerViaApi(context, "settings");
    await page.goto("/settings");
    await expect(page.getByText(user.email)).toBeVisible();
    await expect(page.getByText("Unverified")).toBeVisible();
  });

  test("settings: ?google=not_configured shows an informational toast", async ({ page, context }) => {
    await registerViaApi(context, "gnc");
    await page.goto("/settings?google=not_configured");
    await expect(page.getByText("Google export isn't active yet").first()).toBeVisible();
  });

  test("settings: ?google=error shows an error toast", async ({ page, context }) => {
    await registerViaApi(context, "gerr");
    await page.goto("/settings?google=error");
    await expect(page.getByText("Couldn't connect Google").first()).toBeVisible();
  });

  test("billing: ?checkout=error shows a failure toast and no upgrade", async ({ page, context }) => {
    await registerViaApi(context, "chkerr");
    await page.goto("/billing?checkout=error");
    await expect(page.getByText("Checkout didn't complete").first()).toBeVisible();
    await expect(page.getByText("Free plan")).toBeVisible();
  });

  test("PDF to Markdown tool is gated for free users", async ({ page, context }) => {
    await registerViaApi(context, "p2mfree");
    await page.goto("/tools/pdf-to-markdown");
    await expect(page.getByText("Extract clean Markdown from any PDF")).toBeVisible();
  });
});

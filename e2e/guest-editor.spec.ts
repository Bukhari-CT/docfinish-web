import { expect, test } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { preview, setEditorMarkdown, trackConsoleErrors } from "./helpers";

const TOOL_URL = "/tools/markdown-viewer";

test.describe("guest workspace (no login)", () => {
  test("renders the editor, settings and a paginated preview", async ({ page }) => {
    const errors = trackConsoleErrors(page);
    await page.goto(TOOL_URL);
    await expect(page.locator(".cm-content").first()).toBeVisible();
    await expect(preview(page)).toBeVisible();
    await expect(page.getByText(/\d+ pages? · (A4|Letter)/)).toBeVisible();
    await expect(page.getByLabel("Export PDF")).toBeVisible();
    expect(errors.filter((e) => !/mermaid|ResizeObserver/i.test(e)), errors.join("\n")).toEqual([]);
  });

  test("typing Markdown updates the live preview", async ({ page }) => {
    await page.goto(TOOL_URL);
    await setEditorMarkdown(page, "# Playwright Heading\n\nA **bold** claim and `inline code`.\n\n- item one\n- item two\n");
    await expect(preview(page)).toContainText("Playwright Heading");
    await expect(preview(page)).toContainText("item two");
    await expect(preview(page).locator("strong").first()).toHaveText("bold");
    await expect(preview(page).locator("code").first()).toHaveText("inline code");
  });

  test("renders GFM tables, task lists and code blocks", async ({ page }) => {
    await page.goto(TOOL_URL);
    await setEditorMarkdown(
      page,
      "# T\n\n| A | B |\n|---|---|\n| 1 | 2 |\n\n- [x] done\n- [ ] todo\n\n```js\nconst x = 1;\n```\n",
    );
    await expect(preview(page).locator("table").first()).toBeVisible();
    await expect(preview(page).locator('input[type="checkbox"]').first()).toBeVisible();
    await expect(preview(page).locator("pre").first()).toContainText("const x = 1;");
  });

  test("renders math with KaTeX", async ({ page }) => {
    await page.goto(TOOL_URL);
    await setEditorMarkdown(page, "# Math\n\n$E = mc^2$\n");
    await expect(preview(page).locator(".katex").first()).toBeVisible();
  });

  test("sanitises raw HTML (script tags and event handlers never execute)", async ({ page }) => {
    let dialogSeen = false;
    page.on("dialog", async (d) => {
      dialogSeen = true;
      await d.dismiss();
    });
    await page.goto(TOOL_URL);
    await setEditorMarkdown(page, '# XSS\n\n<script>window.__pwned=1;alert(1)</script>\n\n<img src=x onerror="window.__pwned=1;alert(1)">\n\n[click](javascript:alert(1))\n');
    await expect(preview(page)).toContainText("XSS");
    await page.waitForTimeout(500);
    expect(dialogSeen).toBe(false);
    expect(await page.evaluate(() => (window as unknown as { __pwned?: number }).__pwned)).toBeUndefined();
    await expect(preview(page).locator("script")).toHaveCount(0);
    await expect(preview(page).locator("[onerror]")).toHaveCount(0);
    await expect(preview(page).locator('a[href^="javascript:"]')).toHaveCount(0);
  });

  test("long content paginates into multiple pages", async ({ page }) => {
    await page.goto(TOOL_URL);
    const long = Array.from({ length: 140 }, (_, i) => `Paragraph ${i + 1}. ${"Lorem ipsum dolor sit amet. ".repeat(8)}`).join("\n\n");
    await setEditorMarkdown(page, `# Long\n\n${long}`);
    await expect(page.getByText(/[2-9]\d* pages/)).toBeVisible({ timeout: 20_000 });
  });

  test("draft is saved in the browser and restored after reload", async ({ page }) => {
    await page.goto(TOOL_URL);
    await setEditorMarkdown(page, "# Persisted Draft Title\n\nstill here");
    await expect(preview(page)).toContainText("Persisted Draft Title");
    await page.waitForTimeout(1200);
    await page.reload();
    await expect(preview(page)).toContainText("Persisted Draft Title");
  });

  test("Upload .md loads a file into the editor", async ({ page }) => {
    await page.goto(TOOL_URL);
    const file = path.join(os.tmpdir(), `pw-upload-${Date.now()}.md`);
    fs.writeFileSync(file, "# Uploaded From Disk\n\nfile body");
    await page.locator('input[type="file"]').first().setInputFiles(file);
    await expect(preview(page)).toContainText("Uploaded From Disk");
    await expect(page.getByText(/Loaded pw-upload/)).toBeVisible();
    fs.unlinkSync(file);
  });

  test("Upload rejects non-Markdown files with an error toast", async ({ page }) => {
    await page.goto(TOOL_URL);
    await page.locator('input[type="file"]').first().setInputFiles({ name: "evil.exe", mimeType: "application/octet-stream", buffer: Buffer.from("MZ") });
    await expect(page.getByText("Can't open that file")).toBeVisible();
  });

  test("Upload rejects files over 2 MB", async ({ page }) => {
    await page.goto(TOOL_URL);
    await page.locator('input[type="file"]').first().setInputFiles({
      name: "huge.md",
      mimeType: "text/markdown",
      buffer: Buffer.alloc(2 * 1024 * 1024 + 1024, "a"),
    });
    await expect(page.getByText("Can't open that file")).toBeVisible();
  });

  test("Load sample replaces content and offers Undo", async ({ page }) => {
    await page.goto(TOOL_URL);
    await setEditorMarkdown(page, "# My Own Content");
    await expect(preview(page)).toContainText("My Own Content");
    await page.getByRole("button", { name: "Load sample" }).click();
    await expect(preview(page)).not.toContainText("My Own Content");
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(preview(page)).toContainText("My Own Content");
  });

  test("zoom controls change the zoom label", async ({ page }) => {
    await page.goto(TOOL_URL);
    await expect(page.getByTitle("Toggle fit to width / 100%")).toHaveText("Fit");
    await page.getByRole("button", { name: "Zoom in" }).click();
    await expect(page.getByTitle("Toggle fit to width / 100%")).toHaveText(/\d+%/);
    await page.getByTitle("Toggle fit to width / 100%").click();
    await expect(page.getByTitle("Toggle fit to width / 100%")).toHaveText(/Fit|100%/);
    await page.getByRole("button", { name: "Zoom out" }).click();
  });

  test("editor pane can be toggled", async ({ page }) => {
    await page.goto(TOOL_URL);
    await expect(page.locator(".cm-content").first()).toBeVisible();
    await page.getByRole("button", { name: "Toggle editor" }).click();
    await expect(page.locator(".cm-content")).toHaveCount(0);
    await page.getByRole("button", { name: "Toggle editor" }).click();
    await expect(page.locator(".cm-content").first()).toBeVisible();
  });

  test("changing template asks for confirmation and applies it", async ({ page }) => {
    await page.goto(TOOL_URL);
    const settings = page.locator("aside").last();
    await expect(settings).toBeVisible();
    const templateButton = settings.getByRole("button", { name: /Meeting Notes/ }).first();
    if (await templateButton.count()) {
      await templateButton.click();
    } else {
      await settings.getByText("Meeting Notes").first().click();
    }
    await expect(page.getByRole("dialog")).toContainText("Switch to Meeting Notes?");
    await page.getByRole("button", { name: "Apply template" }).click();
    await expect(page.getByText(/Applied Meeting Notes|Loaded Meeting Notes/)).toBeVisible();
  });

  test("cancelling the template dialog keeps the current template", async ({ page }) => {
    await page.goto(TOOL_URL);
    const settings = page.locator("aside").last();
    await settings.getByText("Meeting Notes").first().click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("Export PDF as a guest prompts to create an account (no export happens)", async ({ page }) => {
    await page.goto(TOOL_URL);
    await expect(page.getByLabel("Export PDF")).toBeEnabled({ timeout: 20_000 });
    await page.getByLabel("Export PDF").click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText(/account|log in|sign up/i);
    await expect(dialog.getByRole("link", { name: "Log in" })).toHaveAttribute("href", /\/login\?next=/);
    await expect(dialog.getByRole("link", { name: /Sign up/ })).toHaveAttribute("href", /\/signup\?next=/);
  });

  test("Google Docs export as a guest requires an account", async ({ page }) => {
    await page.goto(TOOL_URL);
    await page.getByLabel("More export options").click();
    await page.getByRole("menuitem", { name: /Google Docs/ }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("all marketing tool pages mount a working workspace", async ({ page }) => {
    for (const slug of ["markdown-to-pdf", "ai-markdown-to-pdf", "markdown-to-google-docs"]) {
      await page.goto(`/tools/${slug}`);
      await expect(page.locator(".cm-content").first()).toBeVisible();
      await expect(preview(page)).toBeVisible();
    }
  });

  test("PDF to Markdown tool tells guests it is a Pro feature", async ({ page }) => {
    await page.goto("/tools/pdf-to-markdown");
    await expect(page.getByText("Extract clean Markdown from any PDF")).toBeVisible();
    await expect(page.getByRole("link", { name: /Sign up|Log in|Upgrade|See Pro|Create/i }).first()).toBeVisible();
  });
});

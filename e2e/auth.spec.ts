import { expect, test } from "@playwright/test";
import { PASSWORD, loginViaUi, registerViaApi, uniqueEmail } from "./helpers";

test.describe("signup", () => {
  test("shows validation errors for bad email and short password", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill("nope");
    await page.getByLabel("Password").fill("short");
    await page.getByRole("button", { name: "Create free account" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Use 8–128 characters.")).toBeVisible();
    await expect(page).toHaveURL(/\/signup/);
  });

  test("creates an account, lands on the dashboard and greets by name", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel(/Name/).fill("Ada Lovelace");
    await page.getByLabel("Email").fill(uniqueEmail("signup"));
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create free account" }).click();
    await page.waitForURL(/\/dashboard/);
    await expect(page.getByRole("heading", { name: "Welcome back, Ada" })).toBeVisible();
  });

  test("duplicate email shows a friendly error", async ({ page, context }) => {
    const user = await registerViaApi(context, "dupe");
    await context.clearCookies();
    await page.goto("/signup");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create free account" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("already exists");
  });

  test("honours a safe ?next= redirect after signup", async ({ page }) => {
    await page.goto("/signup?next=/pricing");
    await page.getByLabel("Email").fill(uniqueEmail("next"));
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create free account" }).click();
    await page.waitForURL(/\/pricing/);
  });

  test("ignores an open-redirect ?next=", async ({ page }) => {
    await page.goto("/signup?next=//evil.example");
    await page.getByLabel("Email").fill(uniqueEmail("evil"));
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Create free account" }).click();
    await page.waitForURL(/\/dashboard/);
    expect(new URL(page.url()).hostname).toBe("localhost");
  });

  test("links between signup and login", async ({ page }) => {
    await page.goto("/signup");
    await page.getByRole("link", { name: "Log in" }).last().click();
    await expect(page).toHaveURL(/\/login/);
    await page.getByRole("link", { name: "Create an account" }).click();
    await expect(page).toHaveURL(/\/signup/);
  });
});

test.describe("login and logout", () => {
  test("wrong password shows a generic error", async ({ page, context }) => {
    const user = await registerViaApi(context, "badpw");
    await context.clearCookies();
    await page.goto("/login");
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill("Not-The-Password-1");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.locator("form [role=alert]")).toContainText("don't match");
  });

  test("empty fields show inline validation", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page.getByText("Enter a valid email address.")).toBeVisible();
    await expect(page.getByText("Enter your password.")).toBeVisible();
  });

  test("valid login reaches the dashboard and persists across reloads", async ({ page, context }) => {
    const user = await registerViaApi(context, "login", "Grace Hopper");
    await context.clearCookies();
    await loginViaUi(page, user.email);
    await expect(page.getByRole("heading", { name: "Welcome back, Grace" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Welcome back, Grace" })).toBeVisible();
  });

  test("login redirects back to the originally requested page", async ({ page, context }) => {
    const user = await registerViaApi(context, "loginnext");
    await context.clearCookies();
    await page.goto("/settings");
    await page.waitForURL(/\/login\?next=%2Fsettings/);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password").fill(PASSWORD);
    await page.getByRole("button", { name: "Log in" }).click();
    await page.waitForURL(/\/settings/);
  });

  test("authenticated users are redirected away from /login", async ({ page, context }) => {
    await registerViaApi(context, "redir");
    await page.goto("/login");
    await page.waitForURL(/\/dashboard/);
  });

  test("log out returns to /login and protects the app again", async ({ page, context }) => {
    await registerViaApi(context, "logout");
    await page.goto("/dashboard");
    await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
    await page.getByRole("button", { name: /log out/i }).first().click();
    await page.waitForURL(/\/login/);
    await page.goto("/dashboard");
    await page.waitForURL(/\/login\?next=/);
  });
});

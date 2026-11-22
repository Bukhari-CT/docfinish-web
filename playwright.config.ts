import { defineConfig, devices } from "@playwright/test";

const WEB_URL = process.env.E2E_WEB_URL ?? "http://localhost:3100";
const API_URL = process.env.E2E_API_URL ?? "http://localhost:4100";
const webPort = new URL(WEB_URL).port || "3100";
const apiPort = new URL(API_URL).port || "4100";
const channel = process.env.E2E_CHANNEL ?? "chrome";
const manageServers = process.env.E2E_NO_SERVER !== "1";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never", outputFolder: "e2e-report" }]],
  outputDir: "e2e-results",
  use: {
    baseURL: WEB_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: process.env.E2E_VIDEO === "1" ? "retain-on-failure" : "off",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], channel, viewport: { width: 1440, height: 900 } } },
    {
      name: "mobile-chromium",
      testMatch: /(marketing|auth)\.spec\.ts/,
      use: { ...devices["Pixel 7"], channel },
    },
  ],
  webServer: manageServers
    ? [
        {
          command: "npm run build && node build/bin/server.js",
          cwd: "../docfinish-api",
          url: `${API_URL}/health`,
          reuseExistingServer: true,
          timeout: 180_000,
          env: {
            PORT: apiPort,
            WEB_APP_URL: WEB_URL,
            API_BASE_URL: API_URL,
            RATE_LIMIT_ENABLED: "false",
            BILLING_PROVIDER: "mock",
            CONVERSION_PROVIDER: "mock",
            STORAGE_DIR: ".storage-e2e",
          },
        },
        {
          command: `npx next dev -p ${webPort}`,
          url: WEB_URL,
          reuseExistingServer: true,
          timeout: 180_000,
          env: { NEXT_PUBLIC_API_BASE_URL: API_URL, NEXT_PUBLIC_SITE_URL: WEB_URL },
        },
      ]
    : undefined,
});

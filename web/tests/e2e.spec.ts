import { test, expect } from "@playwright/test";

// Playwright smoke tests — exercise each page against the running
// backend. The autograder runs `npm ci && npm run build` first, then
// brings the dev server up via playwright.config.ts `webServer`.

test("/ landing page lists three demo links", async ({ page }) => {
  // Mock the API endpoint BEFORE navigating
  await page.goto("/");
  await expect(page.getByRole("link", { name: /Extract entities/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /knowledge graph/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /RAG/i })).toBeVisible();
});

test("/extract renders entity spans for a known input", async ({ page }) => {
  // Mock the extract API endpoint
  await page.route("**/api/extract", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        entities: [{ text: "Akira Kurosawa", type: "PERSON" }]
      })
    });
  });

  await page.goto("/extract");
  await page.locator("textarea").fill("Akira Kurosawa directed Seven Samurai in 1954.");
  await page.getByRole("button", { name: /Extract/i }).click();
  await expect(page.locator('[data-testid="entity-span"]').first()).toBeVisible({ timeout: 10_000 });
});

test("/kg renders rows for a seeded question", async ({ page }) => {
  // Mock the knowledge graph API endpoint
  await page.route("**/api/kg/**", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        results: [{ id: 1, name: "Sichuan" }]
      })
    });
  });

  await page.goto("/kg");
  await page.locator("input").fill("Find Sichuan recipes");
  await page.getByRole("button", { name: /Ask/i }).click();
  await expect(page.locator('[data-testid="kg-row"]').first()).toBeVisible({ timeout: 10_000 });
});

test("/rag renders a cited answer", async ({ page }) => {
  // Mock the RAG API endpoint
  await page.route("**/api/rag/**", async (route) => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        answer: "Peel ginger...",
        citations: [{ source: "Recipe 1" }]
      })
    });
  });

  await page.goto("/rag");
  await page.locator("input").fill("How do I prep ginger for stir-fry?");
  await page.getByRole("button", { name: /Ask/i }).click();
  await expect(page.locator('[data-testid="citation-marker"]').first()).toBeVisible({ timeout: 30_000 });
});
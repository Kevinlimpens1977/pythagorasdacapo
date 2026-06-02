import { expect, test } from '@playwright/test';

test('local admin can reach the AI settings workspace', async ({ page }) => {
  await page.goto('/login');

  await expect(page.getByRole('heading', { name: /Log in bij HELIX/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Admin testlogin/i })).toBeVisible();

  await page.getByRole('button', { name: /Admin testlogin/i }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('button', { name: 'Beheer', exact: true })).toBeVisible();

  await page.goto('/admin/ai-instellingen');
  await expect(page.getByRole('heading', { name: /Digidocent instellingen/i })).toBeVisible();
  await expect(page.getByText('google/gemini-2.0-flash-001').first()).toBeVisible();
  await expect(page.getByText('gemini-3.5-flash').first()).toBeVisible();
});

test('local student is kept away from admin AI settings', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: /^Developer login$/i }).click();

  await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await page.goto('/admin/ai-instellingen');
  await expect(page).toHaveURL('http://127.0.0.1:5173/');
  await expect(page.getByRole('button', { name: /Lesmateriaal/i })).toBeVisible();
});

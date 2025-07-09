import { test, expect } from '@playwright/test';

const validUser = {
  email: 'cedricheijlman@gmail.com',
  password: 'Test123456!',
};

test.describe('🔐 Validatie', () => {
  test('Validatie bij lege velden', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Wachtwoord')).toBeVisible();

    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.getByText('Vul je e-mailadres in')).toBeVisible();
    await expect(page.getByText('Vul je wachtwoord in')).toBeVisible();
  });

  test('Ongeldig formaat input geeft validatiefouten', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('foutemail'); // fout format
    await page.getByLabel('Wachtwoord').fill('abc'); // te kort

    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.getByText(/geldig e-mailadres/i)).toBeVisible();
    await expect(page.getByText(/minimaal 8 tekens/i)).toBeVisible();
  });
});

test.describe('🧪 Login gedrag', () => {
  test('Ongeldige login toont foutmelding via toast', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill('foute@gmail.com');
    await page.getByLabel('Wachtwoord').fill('abcwdDdw1');
    await page.getByRole('button', { name: 'Inloggen' }).click();

    await expect(page.locator('body')).toContainText(/Inloggen mislukt/i);
  });

  test('Geldige login redirect en cookie', async ({ page, context }) => {
    await page.goto('/login');

    await page.getByLabel('Email').fill(validUser.email);
    await page.getByLabel('Wachtwoord').fill(validUser.password);
    await page.getByRole('button', { name: 'Inloggen' }).click();

    await page.waitForURL('/dashboard');

    const cookies = await context.cookies();
    const token = cookies.find((c) => c.name === 'access_token');
    expect(token).toBeDefined();
  });
});

test.describe('🛡️ Beveiliging', () => {
  test('🛡️ CSRF-aanroep zonder token wordt geblokkeerd vanuit /login', async ({
    page,
    context,
  }) => {
    // 1. Ga naar de loginpagina (zet origin & cookies)
    await page.goto('/login');

    // 2. Verwijder de CSRF-token uit cookies
    await context.clearCookies(); // volledig clean

    // 3. Simuleer in de browser een fetch zonder x-csrf-token header
    const origin = page.url().split('/').slice(0, 3).join('/');

    const result = await page.evaluate(async (origin) => {
      try {
        const res = await fetch(`${origin}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // ⛔ bewust geen 'x-csrf-token'
          },
          body: JSON.stringify({
            email: 'test@zpay.nl',
            password: 'Foute123!',
          }),
        });

        const text = await res.text();
        return { status: res.status, text };
      } catch (error) {
        return { status: 0, text: String(error) };
      }
    }, origin);

    // 4. Verwacht dat de CSRF-check faalt (403)
    expect(result.status).toBe(403);
    expect(result.text).toContain('Er is een fout');
  });
});

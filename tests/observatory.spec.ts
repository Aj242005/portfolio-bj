import { test, expect } from '@playwright/test';

test('orbit drag supports multiple full turns in both directions', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  const readAngle = () => page.evaluate(async () => {
    const modulePath = '/node_modules/.vite/deps/@react-three_fiber.js';
    const { _roots } = await import(modulePath);
    const camera = _roots.get(document.querySelector('canvas')).store.getState().camera;
    return Math.atan2(camera.position.x, camera.position.z);
  });
  const difference = (from: number, to: number) => Math.atan2(Math.sin(to - from), Math.cos(to - from));
  await page.mouse.move(750, 240);
  let previous = await readAngle();
  for (const direction of [1, -1]) {
    let rotation = 0;
    for (let turn = 0; turn < 6; turn++) {
      const start = direction === 1 ? 500 : 1000;
      const end = direction === 1 ? 1000 : 500;
      await page.mouse.move(start, 240);
      await page.mouse.down();
      await page.mouse.move(end, 240, { steps: 2 });
      await page.mouse.up();
      await expect.poll(async () => direction * difference(previous, await readAngle())).toBeGreaterThan(2.4);
      const current = await readAngle();
      rotation += difference(previous, current);
      previous = current;
    }
    expect(direction * rotation).toBeGreaterThan(4 * Math.PI);
  }
  await page.locator('.station-preset').nth(5).click();
  await expect(page.locator('.dossier h2')).toContainText('TRIAD');
  expect(errors).toEqual([]);
});

const stations = [
  ['88.5', 'Kambria', 'Immutable Credit'],
  ['91.2', 'Digital South Trust', 'Public On-Chain'],
  ['94.0', 'Lokachakra', '10K+ Users'],
  ['96.8', 'PQC Research', '4 NIST Finalists'],
  ['99.6', 'Decomm', 'RISC Zero zkVM'],
  ['102.4', 'TRIAD', 'Sub-10ms Decisions'],
  ['105.2', 'ZK Vault', '5 Verified on Sepolia'],
  ['108.0', 'Origin', 'Algorand Semi-Finalist'],
];

test('every signal selects its original engineering evidence, including rapid changes', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  for (const [frequency, name, evidence] of stations) {
    await page.getByRole('button', { name: new RegExp(frequency.replace('.', '\\.') + '.*' + name), exact: false }).last().click();
    await expect(page.locator('.dossier-metrics')).toContainText(evidence);
    await expect(page.locator('.frequency-number')).toContainText(frequency);
    await expect(page.locator('.station-preset[aria-pressed="true"]')).toHaveCount(1);
  }
  await page.getByRole('button', { name: 'Next signal', exact: true }).click();
  await expect(page.locator('.dossier h2')).toContainText('Kambria');
  await page.getByRole('button', { name: 'Previous signal', exact: true }).click();
  await expect(page.locator('.dossier h2')).toContainText('Origin');
  await expect(page.locator('.dossier-content')).toBeVisible();
  await expect(page.locator('.dossier-content')).toHaveCSS('overflow-y', 'auto');
  await page.getByRole('slider').focus();
  await page.keyboard.press('Home');
  await expect(page.getByRole('slider')).toHaveValue('88');
  await page.keyboard.press('End');
  await expect(page.getByRole('slider')).toHaveValue('108');
  await expect(page.locator('.dossier h2')).toContainText('Origin');
  expect(errors).toEqual([]);
});

test('sound, motion, accessible dialog, resume and keyboard controls work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Enable sound', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Mute sound', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Mute sound', exact: true }).click();
  await page.getByRole('button', { name: 'Pause motion', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Resume motion', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'About this experience', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  const popup = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'View résumé', exact: true }).click();
  const resume = await popup;
  await expect(resume.locator('h1')).toContainText('Bhavya Jain');
  await resume.close();
});

test('mobile keeps real 3D, readable content and no overflow at narrow widths', async ({ page }) => {
  for (const width of [320, 390, 760, 768, 1024]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page.locator('canvas')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.getByRole('link', { name: 'View résumé', exact: true })).toBeVisible();
    await page.locator('.station-preset').nth(4).click();
    await expect(page.locator('.dossier h2')).toContainText('Decomm');
  }
});

test('reduced motion and WebGL context loss preserve all navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await page.locator('.station-preset').nth(5).click();
  await expect(page.locator('.dossier h2')).toContainText('TRIAD');
  await page.locator('canvas').evaluate((canvas) => canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
  await expect(page.getByRole('heading', { name: 'Your signals are still here.' })).toBeVisible();
  await page.locator('.station-preset').nth(2).click();
  await expect(page.locator('.dossier h2')).toContainText('Lokachakra');
  await page.getByRole('slider').focus();
  await page.keyboard.press('End');
  await expect(page.locator('.dossier h2')).toContainText('Origin');
});

import assert from 'node:assert/strict'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium, expect } from 'playwright/test'
import { preview } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = process.env.DOCS_DIST || path.join(root, 'docs/dist')
const failures = []
const server = await preview({ configFile: false, build: { outDir: dist }, preview: { host: '127.0.0.1', port: 0, open: false } })
let browser

try {
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.setDefaultTimeout(10000)
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (text) => { globalThis.__docsCopiedText = text } },
    })
  })
  page.on('pageerror', error => failures.push(String(error)))
  page.on('requestfailed', request => failures.push(`${request.url()}: ${request.failure()?.errorText}`))
  page.on('response', (response) => {
    if (response.status() >= 400)
      failures.push(`${response.status()}: ${response.url()}`)
  })
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`

  async function select(framework, theme) {
    if (await page.locator('html').getAttribute('data-framework') !== framework) {
      await page.locator('#ds-fw-trigger').click()
      await page.locator(`[data-framework-option="${framework}"]`).click()
    }
    if (await page.locator('html').getAttribute('data-theme') !== theme)
      await page.locator('#ds-theme-toggle').click()
    await expect(page.locator('html')).toHaveAttribute('data-framework', framework)
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
  }

  async function checkCode(block, theme) {
    await expect(block).toBeVisible()
    await expect(block.locator('pre.shiki > code')).not.toBeEmpty()
    await expect(block.locator('pre code script, pre code input, pre code template, pre code svg')).toHaveCount(0)
    const colors = await block.evaluate((element, theme) => {
      const token = [...element.querySelectorAll('pre.shiki code span[style]')].find(token =>
        token.style.getPropertyValue('--shiki-light') && token.style.getPropertyValue('--shiki-dark'))
      if (!token)
        return null
      const sample = document.createElement('span')
      sample.style.color = token.style.getPropertyValue(`--shiki-${theme}`)
      document.body.append(sample)
      const expected = getComputedStyle(sample).color
      sample.remove()
      return { expected, actual: getComputedStyle(token).color }
    }, theme)
    assert.ok(colors, 'Both vitesse token colors must exist')
    assert.equal(colors.actual, colors.expected, `${theme} token CSS must be applied`)
  }

  for (const route of ['/', '/components/checkbox/']) {
    assert.equal((await page.goto(origin + route)).status(), 200)
    for (const framework of ['vue', 'react', 'solid', 'svelte']) {
      for (const theme of ['light', 'dark']) {
        await select(framework, theme)
        if (route === '/') {
          const blocks = page.locator(`.step-code .ds-fw-content[data-fw="${framework}"]`)
          await expect(blocks).toHaveCount(3)
          for (const block of await blocks.all())
            await checkCode(block, theme)
          await expect(blocks.first()).toContainText(`pnpm add @destyler-ui/${framework}`)
        }
        else {
          const example = page.locator('.ds-component-preview').first()
          const toggle = example.locator('.ds-show-code-btn')
          await toggle.click()
          await expect(toggle).toHaveAttribute('aria-expanded', 'true')
          const block = example.locator(`.ds-code-block[data-fw="${framework}"]`)
          await checkCode(block, theme)
          const text = await block.locator('pre code').textContent()
          assert.ok(text.includes('<'), 'Component markup remains readable source')
          await page.evaluate(() => {
            globalThis.__docsCopiedText = null
          })
          await example.locator('.ds-copy-code-btn').click()
          await expect.poll(() => page.evaluate(() => globalThis.__docsCopiedText)).toBe(text)
          await toggle.click()
          await expect(toggle).toHaveAttribute('aria-expanded', 'false')
        }
        console.log(JSON.stringify({ route, framework, theme, highlighted: true }))
      }
    }
  }
  assert.deepEqual(failures, [], 'Docs highlighting must have no runtime or asset failures')
}
finally {
  await browser?.close()
  await server.close()
}

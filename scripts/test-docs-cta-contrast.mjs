import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

// Check the generated page's cascade, not the colors named in utility classes.
// Both paragraphs are normal text, so require the unrounded WCAG AA 4.5 ratio.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = process.env.DOCS_DIST || path.join(root, 'docs/dist')
const output = process.env.DOCS_CTA_ARTIFACT_DIR || path.join(root, 'test/docs-cta-contrast')
const expectedText = ['READY?', 'Open-source, MIT licensed, and ready for production.']
const result = { themes: [], pageErrors: [], assetErrors: [], cleanupErrors: [], evidenceErrors: [] }
await mkdir(output, { recursive: true })
let server
let browser
let page
let failure

function rgba(value) {
  const match = /^rgba?\(([^)]+)\)$/.exec(value)
  assert.ok(match, `Expected a computed sRGB color, received ${value}`)
  const channels = match[1].split(',').map(value => Number(value.trim()))
  assert.ok(channels.length === 3 || channels.length === 4, `Invalid color ${value}`)
  assert.ok(channels.slice(0, 3).every(value => Number.isFinite(value) && value >= 0 && value <= 255), `Invalid RGB channels ${value}`)
  const alpha = channels[3] ?? 1
  assert.ok(Number.isFinite(alpha) && alpha >= 0 && alpha <= 1, `Invalid alpha ${value}`)
  return [...channels.slice(0, 3), alpha]
}

function luminance(channels) {
  const linear = channels.slice(0, 3).map((value) => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
}

function contrast(paragraph, section) {
  const foreground = rgba(paragraph.color)
  const background = rgba(section.backgroundColor)
  // This CTA uses opaque text over transparent wrappers on an opaque section.
  // Fail if that model changes; never silently treat transparency as black.
  assert.equal(foreground[3], 1, 'CTA text must be opaque')
  assert.equal(background[3], 1, 'CTA section background must be opaque')
  assert.ok(paragraph.ancestors.some(node => node.isSection), 'Paragraph must belong to the CTA section')
  for (const node of paragraph.ancestors) {
    assert.equal(node.opacity, '1', 'CTA text and all ancestors must have full opacity')
    assert.equal(node.filter, 'none', 'CTA text and ancestors must not alter rendered colors with filters')
    assert.equal(node.mixBlendMode, 'normal', 'CTA text and ancestors must not blend colors')
    if (node.withinSection) {
      assert.equal(node.backgroundImage, 'none', 'CTA text background must not use an image')
      assert.equal(rgba(node.backgroundColor)[3], node.isSection ? 1 : 0, 'Only the CTA section supplies the paragraph background')
    }
  }
  const values = [luminance(foreground), luminance(background)]
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05)
}

try {
  server = await preview({ configFile: false, build: { outDir: dist }, preview: { host: '127.0.0.1', port: 0, open: false } })
  browser = await chromium.launch()
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.setDefaultTimeout(10000)
  page.on('pageerror', error => result.pageErrors.push(String(error)))
  page.on('requestfailed', request => result.assetErrors.push({ url: request.url(), error: request.failure()?.errorText }))
  page.on('response', (response) => {
    if (response.status() >= 400)
      result.assetErrors.push({ url: response.url(), status: response.status() })
  })
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`
  for (const theme of ['light', 'dark']) {
    const response = await page.goto(origin)
    if (await page.locator('html').getAttribute('data-theme') !== theme)
      await page.locator('#ds-theme-toggle').click()
    const section = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Start building ToDay' }) })
    const observation = { theme, status: response?.status(), activeTheme: await page.locator('html').getAttribute('data-theme'), sections: [] }
    result.themes.push(observation)
    observation.sections = await section.evaluateAll(elements => elements.map((section) => {
      const sectionStyle = getComputedStyle(section)
      return {
        html: section.outerHTML,
        backgroundColor: sectionStyle.backgroundColor,
        paragraphs: [...section.querySelectorAll('p')].map((paragraph) => {
          const style = getComputedStyle(paragraph)
          const rect = paragraph.getBoundingClientRect()
          const ancestors = []
          let withinSection = true
          for (let node = paragraph; node; node = node.parentElement) {
            const style = getComputedStyle(node)
            ancestors.push({
              tag: node.tagName,
              classes: node.className,
              isSection: node === section,
              withinSection,
              backgroundColor: style.backgroundColor,
              backgroundImage: style.backgroundImage,
              opacity: style.opacity,
              filter: style.filter,
              mixBlendMode: style.mixBlendMode,
            })
            if (node === section)
              withinSection = false
          }
          return {
            text: paragraph.textContent.trim().replace(/\s+/g, ' '),
            html: paragraph.outerHTML,
            color: style.color,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            display: style.display,
            visibility: style.visibility,
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            ancestors,
          }
        }),
      }
    }))
    for (const observedSection of observation.sections) {
      for (const paragraph of observedSection.paragraphs) {
        try {
          paragraph.contrastRatio = contrast(paragraph, observedSection)
        }
        catch (error) {
          paragraph.measurementError = String(error.stack || error)
        }
      }
    }
    // Preserve both themes, including failing colors, before validation.
    await writeFile(path.join(output, 'observations.json'), `${JSON.stringify(result, null, 2)}\n`)
    if (observation.sections.length === 1) {
      await section.scrollIntoViewIfNeeded()
      await section.screenshot({ path: path.join(output, `${theme}.png`) })
    }
    else {
      await page.screenshot({ path: path.join(output, `${theme}.png`), fullPage: true })
    }
  }
  for (const observation of result.themes) {
    assert.equal(observation.status, 200, `${observation.theme}: homepage must load`)
    assert.equal(observation.activeTheme, observation.theme, 'Requested docs theme must be active')
    assert.equal(observation.sections.length, 1, 'Exactly one landing CTA section must be found')
    const { paragraphs } = observation.sections[0]
    assert.deepEqual(paragraphs.map(paragraph => paragraph.text), expectedText, 'Both CTA paragraphs must be measured')
    for (const paragraph of paragraphs) {
      assert.equal(paragraph.measurementError, undefined, paragraph.measurementError)
      assert.notEqual(paragraph.display, 'none', 'CTA paragraph must be displayed')
      assert.equal(paragraph.visibility, 'visible', 'CTA paragraph must be visible')
      assert.ok(paragraph.rect.width > 0 && paragraph.rect.height > 0, 'CTA paragraph must have a rendered box')
      assert.ok(paragraph.contrastRatio >= 4.5, `${observation.theme}/${paragraph.text}: ${paragraph.contrastRatio}:1 is below 4.5:1`)
    }
  }
  assert.deepEqual(result.pageErrors, [], 'Generated docs must not throw')
  assert.deepEqual(result.assetErrors, [], 'Generated docs assets must load')
  result.status = 'passed'
}
catch (error) {
  failure = error
  result.status = 'failed'
  result.error = String(error.stack || error)
  await page?.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(error => result.evidenceErrors.push(String(error)))
}
finally {
  const cleanup = await Promise.allSettled([
    browser?.close(),
    server && new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())),
  ])
  for (const [index, entry] of cleanup.entries()) {
    if (entry.status === 'rejected')
      result.cleanupErrors.push({ resource: index === 0 ? 'browser' : 'preview server', error: String(entry.reason) })
  }
  if (result.cleanupErrors.length || result.evidenceErrors.length) {
    result.status = 'failed'
    failure ||= new Error('Could not preserve evidence or close the CTA contrast test resources')
  }
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(result, null, 2)}\n`).catch((error) => {
    console.error('Could not write CTA contrast evidence:', error)
    failure ||= error
  })
}
if (failure)
  throw failure

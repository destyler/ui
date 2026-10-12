import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { preview } from 'vite'

// Exercise the actual generated docs, including Astro's JSX renderer filters and
// dependency export conditions. The package's broader Solid test config cannot
// catch a dependency being compiled with React's JSX runtime in the docs build.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = process.env.DOCS_DIST || path.join(root, 'docs/dist')
const output = process.env.DOCS_SOLID_ICON_ARTIFACT_DIR || path.join(root, 'test/docs-solid-icons')
await mkdir(output, { recursive: true })
const result = { states: [], pageErrors: [], assetErrors: [], bundles: [], cleanupErrors: [], evidenceErrors: [] }
const captures = []
const server = await preview({ configFile: false, build: { outDir: dist }, preview: { host: '127.0.0.1', port: 0, open: false } })
let browser
let page
let failure

async function observe(frame, label, state, visibleIcon) {
  const observation = await frame.evaluate((element) => {
    const control = element.querySelector('[data-scope="checkbox"][data-part="control"]')
    return {
      html: element.outerHTML,
      state: control?.getAttribute('data-state'),
      indicators: [...element.querySelectorAll('[data-scope="checkbox"][data-part="indicator"]')].map((indicator) => {
        const indicatorRect = indicator.getBoundingClientRect()
        const indicatorStyle = getComputedStyle(indicator)
        const svg = indicator.querySelector('svg')
        const shape = svg?.querySelector('path')
        const rect = svg?.getBoundingClientRect()
        const style = svg && getComputedStyle(svg)
        const shapeStyle = shape && getComputedStyle(shape)
        let opacity = 1
        for (let node = svg; node; node = node.parentElement)
          opacity *= Number(getComputedStyle(node).opacity)
        const bbox = shape?.getBBox()
        return {
          hidden: indicator.hasAttribute('hidden'),
          state: indicator.getAttribute('data-state'),
          indicatorRect: { x: indicatorRect.x, y: indicatorRect.y, width: indicatorRect.width, height: indicatorRect.height },
          indicatorDisplay: indicatorStyle.display,
          indicatorVisibility: indicatorStyle.visibility,
          svgCount: indicator.querySelectorAll('svg').length,
          svgRect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null,
          icon: svg?.classList.contains('lucide-check') ? 'check' : svg?.classList.contains('lucide-minus') ? 'minus' : null,
          namespace: svg?.namespaceURI,
          path: shape?.getAttribute('d'),
          width: rect?.width,
          height: rect?.height,
          visibility: style?.visibility,
          display: style?.display,
          stroke: shapeStyle?.stroke,
          strokeWidth: shapeStyle?.strokeWidth,
          bbox: bbox && { width: bbox.width, height: bbox.height },
          visible: !!rect && rect.width > 0 && rect.height > 0 && style.visibility === 'visible' && style.display !== 'none' && opacity > 0,
        }
      }),
    }
  })
  // Retain the failing DOM before making assertions so empty icons are diagnosable.
  result.states.push({ label, expectedState: state, visibleIcon, ...observation })
}

function validate(observation) {
  const { label, expectedState: state, visibleIcon } = observation
  assert.equal(observation.state, state, `${label}: control state`)
  assert.equal(observation.indicators.length, label.includes('indeterminate') ? 2 : 1, `${label}: indicator count`)
  for (const indicator of observation.indicators) {
    assert.equal(indicator.svgCount, 1, `${label}: one SVG per indicator`)
    assert.ok(indicator.icon, `${label}: an indicator must contain its SVG icon`)
    assert.equal(indicator.namespace, 'http://www.w3.org/2000/svg', `${label}: SVG namespace`)
    assert.equal(indicator.path, indicator.icon === 'check' ? 'M20 6 9 17l-5-5' : 'M5 12h14', `${label}: icon path`)
    assert.equal(indicator.state, state, `${label}: indicator state`)
    assert.equal(indicator.hidden, indicator.icon !== visibleIcon, `${label}: hidden state`)
    assert.equal(indicator.visible, indicator.icon === visibleIcon, `${label}: rendered visibility`)
    if (indicator.visible) {
      assert.notEqual(indicator.stroke, 'none', `${label}: visible stroke`)
      assert.ok(Number.parseFloat(indicator.strokeWidth) > 0, `${label}: stroke width`)
      assert.ok(indicator.bbox.width > 0 || indicator.bbox.height > 0, `${label}: path geometry`)
    }
  }
}

try {
  browser = await chromium.launch()
  page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  page.setDefaultTimeout(10000)
  page.on('pageerror', error => result.pageErrors.push(String(error)))
  page.on('requestfailed', request => result.assetErrors.push({ url: request.url(), error: request.failure()?.errorText }))
  page.on('response', (response) => {
    if (response.status() >= 400)
      result.assetErrors.push({ url: response.url(), status: response.status() })
    if (response.url().endsWith('.js')) {
      captures.push(response.body().then(async (bytes) => {
        // Keep the actual generated Check/Minus chunks, not only source fixtures.
        if (!bytes.includes('M20 6 9 17l-5-5') && !bytes.includes('M5 12h14'))
          return
        const name = path.basename(new URL(response.url()).pathname)
        await writeFile(path.join(output, name), bytes)
        result.bundles.push({ url: response.url(), name, sha256: createHash('sha256').update(bytes).digest('hex') })
      }).catch(error => result.assetErrors.push({ url: response.url(), captureError: String(error) })))
    }
  })
  const origin = `http://127.0.0.1:${server.httpServer.address().port}`
  for (const theme of ['light', 'dark']) {
    assert.equal((await page.goto(`${origin}/components/checkbox/`)).status(), 200)
    if (await page.locator('html').getAttribute('data-theme') !== theme)
      await page.locator('#ds-theme-toggle').click()
    if (await page.locator('html').getAttribute('data-framework') !== 'solid') {
      await page.locator('#ds-fw-trigger').click()
      await page.locator('[data-framework-option="solid"]').click()
    }
    assert.equal(await page.locator('html').getAttribute('data-theme'), theme, 'The requested docs theme must be active')
    assert.equal(await page.locator('html').getAttribute('data-framework'), 'solid', 'The Solid docs examples must be active')
    for (const example of ['basic', 'indeterminate']) {
      const frame = page.locator(`.ds-preview-frame.checkbox-${example}[data-fw="solid"]`).first()
      await frame.scrollIntoViewIfNeeded()
      await frame.locator('astro-island:not([ssr])').waitFor()
      const control = frame.locator('[data-scope="checkbox"][data-part="control"]')
      await control.waitFor()
      await observe(frame, `${theme}/${example}/initial`, example === 'indeterminate' ? 'indeterminate' : 'unchecked', example === 'indeterminate' ? 'minus' : null)
      for (const [index, state] of ['checked', 'unchecked', 'checked'].entries()) {
        await control.click()
        await page.waitForFunction(({ selector, state }) => document.querySelector(selector)?.getAttribute('data-state') === state, {
          selector: `.ds-preview-frame.checkbox-${example}[data-fw="solid"] [data-part="control"]`,
          state,
        })
        await observe(frame, `${theme}/${example}/click-${index + 1}`, state, state === 'checked' ? 'check' : null)
      }
    }
  }
  await Promise.all(captures)
  for (const observation of result.states)
    validate(observation)
  assert.deepEqual(result.pageErrors, [], 'Generated Solid docs must not throw')
  assert.deepEqual(result.assetErrors, [], 'Generated Solid docs assets must load')
  result.status = 'passed'
}
catch (error) {
  failure = error
  result.status = 'failed'
  result.error = String(error.stack || error)
  await page?.screenshot({ path: path.join(output, 'failure.png'), fullPage: true }).catch(error => result.evidenceErrors.push(String(error)))
}
finally {
  await Promise.all(captures)
  const cleanup = await Promise.allSettled([
    browser?.close(),
    new Promise((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve())),
  ])
  for (const [index, entry] of cleanup.entries()) {
    if (entry.status === 'rejected')
      result.cleanupErrors.push({ resource: index === 0 ? 'browser' : 'preview server', error: String(entry.reason) })
  }
  if (result.cleanupErrors.length || result.evidenceErrors.length) {
    result.status = 'failed'
    failure ||= new Error('Could not fully preserve evidence or close the docs icon test resources')
  }
  await writeFile(path.join(output, 'results.json'), `${JSON.stringify(result, null, 2)}\n`).catch((error) => {
    console.error('Could not write docs icon test evidence:', error)
    failure ||= error
  })
}
if (failure)
  throw failure

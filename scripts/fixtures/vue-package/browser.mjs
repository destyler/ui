import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import http from 'node:http'
import { chromium } from 'playwright'
import { createServer } from 'vite'

// CI-only real-browser coverage. The default local suite does not need a
// browser installation or a listening socket.
const html = await readFile('ssr.html', 'utf8')
const vite = await createServer({ configFile: false, define: { __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false, __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true }, server: { middlewareMode: true } })
const server = http.createServer((request, response) => {
  if (request.url !== '/')
    return vite.middlewares(request, response)
  response.setHeader('Content-Type', 'text/html')
  response.end(`<!doctype html><html><head><link rel="icon" href="data:,"></head><body><div id="consumer">${html}</div><script type="module">
    import { mount } from '/browser-client.mjs'
    const container = document.querySelector('#consumer')
    window.__packedOriginal = container.querySelector('#packed-toggle')
    window.__packedChanges = { pressed: [], open: [] }
    window.__packedDispose = mount(container, window.__packedChanges)
    window.__packedHydrated = true
  </script></body></html>`)
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
let browser
try {
  browser = await chromium.launch()
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(String(error)))
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type()))
      errors.push(message.text())
  })
  await page.goto(`http://127.0.0.1:${server.address().port}`)
  await page.waitForFunction(() => window.__packedHydrated)
  assert.equal(await page.evaluate(() => window.__packedOriginal === document.querySelector('#packed-toggle')), true)
  const toggle = page.locator('#packed-toggle')
  for (const pressed of ['true', 'false']) {
    await toggle.click()
    await page.waitForFunction(value => document.querySelector('#packed-toggle').getAttribute('aria-pressed') === value, pressed)
  }
  const trigger = page.locator('[data-scope="collapsible"][data-part="trigger"]')
  for (const open of ['true', 'false']) {
    await trigger.click()
    await page.waitForFunction(value => document.querySelector('[data-scope="collapsible"][data-part="trigger"]').getAttribute('aria-expanded') === value, open)
  }
  assert.deepEqual(await page.evaluate(() => window.__packedChanges), { pressed: [true, false], open: [true, false] })
  await page.evaluate(() => window.__packedDispose())
  assert.deepEqual(errors, [], 'The real-browser consumer must hydrate and interact without warnings or errors')
}
finally {
  await browser?.close()
  await vite.close()
  await new Promise(resolve => server.close(resolve))
}

import assert from 'node:assert/strict'
import http from 'node:http'
import { chromium } from 'playwright'
import { createServer } from 'vite'

const vite = await createServer({ configFile: false, server: { middlewareMode: true } })
const server = http.createServer((request, response) => {
  if (request.url !== '/')
    return vite.middlewares(request, response)
  response.setHeader('Content-Type', 'text/html')
  response.end(`<!doctype html><html><head><link rel="icon" href="data:,"></head><body><div id="consumer"></div><script type="module">
    import { entries, mount } from '/import-client/index.js'
    window.__packedEntries = Object.keys(entries).length
    window.__packedChanges = { pressed: [], open: [] }
    window.__packedDispose = mount(document.querySelector('#consumer'), window.__packedChanges)
    window.__packedMounted = true
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
  await page.waitForFunction(() => window.__packedMounted)
  assert.equal(await page.evaluate(() => window.__packedEntries), 57)
  const toggle = page.locator('#packed-toggle')
  assert.equal(await toggle.getAttribute('aria-pressed'), 'false')
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
  assert.deepEqual(errors, [], 'The real-browser default consumer must render and interact without warnings or errors')
}
finally {
  await browser?.close()
  await vite.close()
  await new Promise(resolve => server.close(resolve))
}

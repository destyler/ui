import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { fixture } from './fixture.mjs'

const html = await renderToString(createSSRApp({ render: () => fixture() }))
assert.match(html, /id="packed-toggle"/)
assert.match(html, /aria-pressed="false"/)
assert.match(html, /<input[^>]*data-scope="edit"[^>]*value="Packed edit"/)
assert.match(html, /<span[^>]*data-part="preview"[^>]*>Packed edit<\/span>/)
await writeFile('ssr.html', html)

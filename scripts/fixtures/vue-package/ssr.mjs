import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { fixture } from './fixture.mjs'

const html = await renderToString(createSSRApp({ render: () => fixture() }))
assert.match(html, /id="packed-toggle"/)
assert.match(html, /aria-pressed="false"/)
await writeFile('ssr.html', html)

import assert from 'node:assert/strict'
import { writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { Fixture } from './fixture.mjs'

assert.equal(typeof window, 'undefined')
assert.equal(typeof document, 'undefined')
const markup = renderToString(createElement(Fixture))
assert.match(markup, /aria-pressed="false"/)
assert.match(markup, /aria-expanded="false"/)
assert.match(markup, /Packed consumer content/)
await writeFile('ssr.html', markup)

import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const docsRequire = createRequire(import.meta.url)
const astroRequire = createRequire(docsRequire.resolve('astro'))

export function loadAstroCompiler(packageName) {
  // A hoisted legacy compiler can resolve even after Astro stops using it.
  assert.ok(Object.hasOwn(astroRequire('astro/package.json').dependencies, packageName), `Docs checks must use a compiler declared by the installed Astro: ${packageName}`)
  return astroRequire(packageName)
}

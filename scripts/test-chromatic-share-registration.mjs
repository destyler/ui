import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'

const require = createRequire(import.meta.url)
const packagePath = require.resolve('@chromatic-com/storybook/package.json')
const manifest = JSON.parse(readFileSync(packagePath, 'utf8'))
const manager = readFileSync(join(dirname(packagePath), 'dist/manager.mjs'))
const originalHash = 'd0db1df678ae5591240447fef075055143307084bbfabe369a3826d38349edf3'
const patchedHash = '8e1872437b328cfe665982c1c1f16d1ad7f4d309e4d5ee55c31a2c27e37eeaf1'
const removed = `,addons.add(\`\${z}/share-tool\`,{type:Addon_TypesEnum.TOOLEXTRA,title:"Share",render:()=>s__default.createElement(Gf,{api:e})})`
const addonId = 'chromaui/addon-visual-tests'
const digest = bytes => createHash('sha256').update(bytes).digest('hex')

// Version-bound registration check only: no module startup, render, auth or service calls.
// The server Share handler remains; this patch removes the normal UI entry point.
function registrations(bytes, mode) {
  assert.ok([originalHash, patchedHash].includes(digest(bytes)), 'Review exact bundle bytes before evaluating registration')
  const source = bytes.toString('utf8')
  const start = source.lastIndexOf('addons.register(z,e=>{')
  assert.notEqual(start, -1, 'Review the registration extraction when upgrading the addon')
  const end = source.indexOf('\n/*! Bundled license information:', start)
  assert.notEqual(end, -1)
  const added = new Map()
  runInNewContext(source.slice(start, end), {
    CONFIG_TYPE: mode,
    z: addonId,
    zt: `${addonId}/panel`,
    io: `${addonId}/test-provider`,
    a5: `${addonId}/highlightIgnored/select`,
    o5: 'storybook/highlight/menu-click',
    t5: 'chromatic',
    Addon_TypesEnum: { TOOL: 'tool', PANEL: 'panel', TOOLEXTRA: 'tooextra', experimental_TEST_PROVIDER: 'provider' },
    addons: {
      register: (id, callback) => {
        assert.equal(id, addonId)
        callback({
          on() {},
          getChannel() { return undefined },
        })
      },
      add: (id, options) => {
        assert.equal(added.has(id), false, `Duplicate registration: ${id}`)
        added.set(id, options)
      },
    },
    experimental_getStatusStore: () => ({ onSelect() {} }),
  }, { timeout: 1000 })
  return added
}

function checkRegistrations(bytes, mode) {
  const added = registrations(bytes, mode)
  assert.equal(added.has(`${addonId}/share-tool`), false, 'Share must not be registered')
  assert.equal(added.get(`${addonId}/panel`)?.title, 'Visual tests')
  assert.equal(added.get(`${addonId}/panel`)?.type, 'panel')
  assert.equal(added.has(`${addonId}/ignore-highlight-tool`), true)
  assert.equal(added.has(`${addonId}/test-provider`), mode === 'DEVELOPMENT')
  if (mode === 'DEVELOPMENT')
    assert.equal(added.get(`${addonId}/test-provider`)?.type, 'provider')
  assert.equal(added.size, mode === 'DEVELOPMENT' ? 3 : 2)
}

test('installed Chromatic 5.5.1 has the exact Share-only patch', () => {
  assert.equal(manifest.version, '5.5.1', 'Review and rebase the package patch before upgrading')
  assert.equal(digest(manager), patchedHash, 'Installed manager must match the reviewed 125-byte removal')
  assert.equal(manager.includes(removed), false)
})

for (const mode of ['DEVELOPMENT', 'PRODUCTION']) {
  test(`installed ${mode} registration preserves Visual Tests without Share`, () => {
    checkRegistrations(manager, mode)
  })
}

test('the same development registration guard rejects the exact official unpatched package', () => {
  // Restore the sole removed expression at its original byte offset. The hash
  // proves this negative control is the official bundle, without vendoring it.
  const original = Buffer.concat([manager.subarray(0, 619629), Buffer.from(removed), manager.subarray(619629)])
  assert.equal(digest(original), originalHash)
  assert.throws(() => checkRegistrations(original, 'DEVELOPMENT'), /Share must not be registered/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Use an isolated, scripts-disabled npm installation, never the publishing CLI.
// This is an explicit release-preparation check, not a network-dependent CI test.
test('actual changelogithub discovers and renders UI 0.0.3 migration notices', async () => {
  assert.ok(process.env.CHANGELOGITHUB_TEST_ROOT, 'Set CHANGELOGITHUB_TEST_ROOT to an isolated changelogithub installation (see docs/releases/0.0.3.md)')
  const require = createRequire(resolve(process.env.CHANGELOGITHUB_TEST_ROOT, 'package.json'))
  const manifest = require('changelogithub/package.json')
  const previousFetch = globalThis.fetch
  const previousCwd = process.cwd()
  globalThis.fetch = () => {
    throw new Error('Network is forbidden during changelog rendering')
  }
  try {
    // c12 discovers config from process.cwd(), not resolveConfig options.cwd.
    process.chdir(root)
    const { resolveConfig, parseCommits, generateMarkdown } = await import(pathToFileURL(require.resolve('changelogithub')).href)
    // Exercise automatic repository config discovery, as the release CLI does.
    const config = await resolveConfig({ cwd: root, from: 'v0.0.2', to: 'v0.0.3', repo: 'destyler/ui', contributors: false })
    const raw = (message, body = '') => ({ message, body, shortHash: '1234567', author: { name: 'Fixture', email: 'fixture@example.invalid' } })
    const commits = parseCommits([
      raw('chore(release)!: prepare UI 0.0.3 with core 0.3.4', 'BREAKING CHANGE: Core 0.3.4 changes Steps keyboard navigation and completion roles, and Select composite focus ownership. See docs/releases/0.0.3.md.'),
      raw('fix(vue): preserve Steps and Select caller events (#169)'),
      raw('feat: example feature'),
      raw('perf: example optimization'),
    ], config)
    const output = generateMarkdown(commits, config)
    const notes = 'https://github.com/destyler/ui/blob/v0.0.3/docs/releases/0.0.3.md'
    for (const fragment of [
      `(${notes})`,
      `(${notes}#steps-keyboard-navigation-and-completion-roles)`,
      `(${notes}#select-focus-ownership)`,
      `(${notes}#vue-listener-and-callback-fixes)`,
      'one roving tab stop',
      'no longer a tabpanel',
      'Content owns focus',
      '`.once.prevent` may run after core',
      '`event.defaultPrevented`',
      'Bug Fixes',
      'Features',
      'Performance',
      'Preserve Steps and Select caller events',
      'https://github.com/destyler/ui/issues/169',
      '/compare/v0.0.2...v0.0.3',
    ]) assert.ok(output.includes(fragment), `Missing rendered release content: ${fragment}`)

    const markdown = readFileSync(resolve(root, 'docs/releases/0.0.3.md'), 'utf8')
    for (const heading of ['Steps keyboard navigation and completion roles', 'Select focus ownership', 'Vue listener and callback fixes'])
      assert.ok(markdown.includes(` ${heading}\n`), `Missing versioned migration heading: ${heading}`)

    // A non-breaking squash loses this section: release instructions must retain !.
    const ordinary = generateMarkdown(parseCommits([raw('chore: release UI 0.0.3')], config), config)
    assert.ok(!ordinary.includes(notes))
    console.log(`Verified changelogithub ${manifest.version}: config discovery, migration links, cancellation limits, and normal sections`)
    if (process.env.CHANGELOGITHUB_PRINT_OUTPUT === '1')
      console.log(output)
  }
  finally {
    globalThis.fetch = previousFetch
    process.chdir(previousCwd)
  }
})

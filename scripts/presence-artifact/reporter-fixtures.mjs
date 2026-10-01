import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { probes, verifyReport } from './report.mjs'

// Exercise the installed Vitest reporter APIs in Node, without opening a browser.
const root = fileURLToPath(new URL('../../', import.meta.url))
mkdirSync(join(root, '.temp'), { recursive: true })
const directory = mkdtempSync(join(root, '.temp/presence-reporter-'))
const config = join(directory, 'vitest.config.mjs')
const spec = join(directory, 'runner.fixture.mjs')
writeFileSync(config, `export default { test: { environment: 'node', include: [${JSON.stringify(spec)}], retry: 0 } }\n`)

for (const scenario of ['marked-only', 'marked-and-hook-error', 'marked-and-suite-error', 'marked-and-unhandled-error']) {
  const file = join(directory, `${scenario}.json`)
  const runnerFile = `${file}.runner.json`
  const firstBody = scenario === 'marked-and-unhandled-error'
    ? 'Promise.reject(new Error(\'UNHANDLED_FIXTURE_ERROR\')); await new Promise(resolve => setTimeout(resolve, 20));'
    : ''
  writeFileSync(spec, `
import { afterAll, afterEach, expect, it } from 'vitest'
afterAll(() => {
  if (${JSON.stringify(scenario)} === 'marked-and-suite-error')
    throw new Error('SUITE_FIXTURE_ERROR')
})
let first = true
afterEach(() => {
  if (first && ${JSON.stringify(scenario)} === 'marked-and-hook-error') {
    first = false
    throw new Error('HOOK_FIXTURE_ERROR')
  }
  first = false
})
it(${JSON.stringify(probes[0][0])}, async () => {
  ${firstBody}
  expect(false, ${JSON.stringify(probes[0][1])}).toBe(true)
})
it(${JSON.stringify(probes[1][0])}, () => expect(true).toBe(true))
it(${JSON.stringify(probes[2][0])}, () => expect(true).toBe(true))
`)
  const command = spawnSync('pnpm', [
    'exec',
    'vitest',
    'run',
    '--config',
    config,
    '--reporter=json',
    `--reporter=${resolve(root, 'scripts/presence-artifact/runner-reporter.mjs')}`,
    `--outputFile.json=${file}`,
  ], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, PRESENCE_RUNNER_REPORT: runnerFile },
    timeout: 30_000,
  })
  writeFileSync(join(directory, `${scenario}.log`), `${command.stdout}\n${command.stderr}`)
  assert.equal(command.status, 1, `fixture failed to execute: ${command.stdout}\n${command.stderr}`)
  const report = JSON.parse(readFileSync(file, 'utf8'))
  const runner = JSON.parse(readFileSync(runnerFile, 'utf8'))
  // Chai emits AssertionError, unlike the jest-dom matcher used by the browser
  // probe. Normalize just this fixture's assertion prefix to exercise the gate.
  report.testResults[0].assertionResults[0].failureMessages[0]
    = report.testResults[0].assertionResults[0].failureMessages[0].replace(/^AssertionError:/, 'Error:')
  if (scenario === 'marked-only') {
    verifyReport(report, 'negative', command.status, runner)
  }
  else {
    if (scenario === 'marked-and-suite-error')
      assert.equal(runner.modules[0].errors.length, 1, 'real suite error was not captured')
    if (scenario === 'marked-and-unhandled-error')
      assert.equal(runner.unhandledErrors.length, 1, 'real unhandled error was not captured')
    assert.throws(() => verifyReport(report, 'negative', command.status, runner))
  }
  console.log(`${scenario}: verified using actual Vitest JSON and supplemental runner evidence`)
}
console.log(`Reporter fixture evidence: ${directory}`)

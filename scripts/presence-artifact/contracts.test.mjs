import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
// Node contract checks run before Chromium; do not migrate this import to Vitest.
// eslint-disable-next-line test/no-import-node-test
import { it } from 'node:test'
import { consumerLock, unchangedDependencies } from './prepare.mjs'
import { probes, verifyReport } from './report.mjs'

function runner(mode = 'negative') {
  return {
    reason: mode === 'negative' ? 'failed' : 'passed',
    unhandledErrors: [],
    modules: fixture(mode).testResults.map(suite => ({ name: suite.name, errors: [] })),
  }
}

function fixture(mode = 'negative') {
  const assertionResults = probes.map(([title, marker], index) => ({
    title,
    status: mode === 'negative' && index === 0 ? 'failed' : 'passed',
    failureMessages: mode === 'negative' && index === 0 ? [`Error: ${marker} backdrop detached before animationend`] : [],
  }))
  const testResults = [{ name: '/fixture/test-artifact/tour-presence.probe.tsx', assertionResults }]
  if (mode === 'positive') {
    testResults.push({
      name: '/fixture/src/components/tour/test/tour.test.tsx',
      assertionResults: [
        { title: 'uses the root presence for content exit animations', status: 'passed', failureMessages: [] },
        ...Array.from({ length: 17 }, (_, index) => ({ title: `original fixture ${index}`, status: 'passed', failureMessages: [] })),
      ],
    })
  }
  const total = testResults.flatMap(suite => suite.assertionResults).length
  return {
    success: mode === 'positive',
    numTotalTests: total,
    numPassedTests: total - (mode === 'negative' ? 1 : 0),
    numFailedTests: mode === 'negative' ? 1 : 0,
    numPendingTests: 0,
    numTodoTests: 0,
    numRuntimeErrorTestSuites: 0,
    testResults,
  }
}

it('accepts a required, assertion-specific negative and complete positive', () => {
  assert.equal(verifyReport(fixture(), 'negative', 1, runner()).failed, 1)
  assert.equal(verifyReport(fixture('positive'), 'positive', 0, runner('positive')).failed, 0)
})

for (const [name, mutate] of [
  ['unexpected assertion', report => report.testResults[0].assertionResults[0].failureMessages = ['timeout']],
  ['missing failure', report => report.testResults[0].assertionResults[0].status = 'passed'],
  ['skipped test', report => report.numPendingTests = 1],
  ['todo test', report => report.numTodoTests = 1],
  ['runtime error', report => report.numRuntimeErrorTestSuites = 1],
  ['unhandled error', report => report.unhandledErrors = ['error']],
  ['missing probe', report => report.testResults[0].assertionResults.pop()],
  ['empty suite', report => report.testResults.push({ assertionResults: [] })],
]) {
  it(`rejects negative control with ${name}`, () => {
    const report = fixture()
    mutate(report)
    assert.throws(() => verifyReport(report, 'negative', 1, runner()))
  })
}

it('rejects a negative command that succeeded or crashed', () => {
  for (const exit of [0, 2, 137])
    assert.throws(() => verifyReport(fixture(), 'negative', exit, runner()))
})

it('rejects a positive command failure and a missing original suite', () => {
  assert.throws(() => verifyReport(fixture('positive'), 'positive', 1, runner('positive')))
  const report = fixture('positive')
  report.testResults.pop()
  report.numTotalTests--
  assert.throws(() => verifyReport(report, 'positive', 0, runner('positive')))
})

const lock = `lockfileVersion: '9.0'

packages:

  '@destyler/presence@0.2.9':
    resolution: {integrity: registry}

  '@destyler/xstate@0.2.9':
    resolution: {integrity: original}

snapshots:

  '@destyler/presence@0.2.9':
    dependencies:
      '@destyler/xstate': 0.2.9

  consumer@1.0.0:
    dependencies:
      '@destyler/presence': 0.2.9
      '@destyler/xstate': 0.2.9
`

it('allows only Presence resolution and reference changes', () => {
  const candidate = lock.replaceAll('@destyler/presence@0.2.9', '@destyler/presence@file:/candidate.tgz')
    .replace('integrity: registry', 'integrity: candidate, tarball: file:/candidate.tgz')
    .replace('\'@destyler/presence\': 0.2.9', '\'@destyler/presence\': file:/candidate.tgz')
  assert.deepEqual(unchangedDependencies(lock), unchangedDependencies(candidate))
  assert.notDeepEqual(unchangedDependencies(lock), unchangedDependencies(candidate.replace('integrity: original', 'integrity: moved')))
  assert.notDeepEqual(unchangedDependencies(lock), unchangedDependencies(candidate.replaceAll('\'@destyler/xstate\': 0.2.9', '\'@destyler/xstate\': 0.3.0')))
})

it('workflow pins the reviewed source, requires both controls, and never releases', () => {
  const workflow = readFileSync(new URL('../../.github/workflows/presence-artifact.yml', import.meta.url), 'utf8')
  assert.match(workflow, /ref: 691bcbd43030ba4db4980a8d910e032a947ce01e/)
  assert.match(workflow, /pnpm install --frozen-lockfile/g)
  assert.match(workflow, /report\.mjs negative/)
  assert.match(workflow, /report\.mjs positive/)
  assert.doesNotMatch(workflow, /continue-on-error|publish:ci|git push|npm publish/)
})

it('rejects missing runner evidence and marked failures accompanied by other errors', () => {
  assert.throws(() => verifyReport(fixture(), 'negative', 1))
  const unhandled = runner()
  unhandled.unhandledErrors.push({ message: 'unhandled fixture error' })
  assert.throws(() => verifyReport(fixture(), 'negative', 1, unhandled))
  const hook = fixture()
  hook.testResults[0].assertionResults[0].failureMessages.push('Error: afterEach hook failed')
  assert.throws(() => verifyReport(hook, 'negative', 1, runner()))
  const suite = fixture()
  suite.testResults[0].message = 'afterAll failed'
  assert.throws(() => verifyReport(suite, 'negative', 1, runner()))
})

it('rejects importer and catalog drift even when package resolutions are unchanged', () => {
  const imports = `lockfileVersion: '9.0'\nimporters:\n  packages/solid:\n    dependencies:\n      unrelated:\n        specifier: ^1.0.0\n        version: 1.0.0\ncatalogs:\n  test:\n    unrelated:\n      specifier: ^1.0.0\n      version: 1.0.0\n`
  assert.notEqual(unchangedDependencies(imports), unchangedDependencies(imports.replace('version: 1.0.0', 'version: 1.1.0')))
  assert.notEqual(unchangedDependencies(imports), unchangedDependencies(imports.replace('specifier: ^1.0.0', 'specifier: ^2.0.0')))
})

it('creates a consumer lock with exactly one changed importer and one added packed artifact', () => {
  const source = readFileSync(new URL('../../pnpm-lock.yaml', import.meta.url), 'utf8')
  const result = consumerLock(source, 'sha512-Zml4dHVyZQ==')
  assert.equal(unchangedDependencies(source), unchangedDependencies(result))
  assert.equal(result.split('specifier: file:../../.temp/presence.tgz').length, 2)
  assert.equal(result.split('\'@destyler/presence@file:.temp/presence.tgz\':').length, 3)
  assert.equal(source.includes('file:.temp/presence.tgz'), false)
})

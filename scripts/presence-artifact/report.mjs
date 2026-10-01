import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { pathToFileURL } from 'node:url'

export const probes = [
  ['retains backdrop when closed before its first frame', 'PRESENCE_EARLY_EXIT:'],
  ['refreshes the enter sample after reopening before the first frame', 'PRESENCE_REOPEN_SAMPLE:'],
  ['retains a repeated exit after reopening during a suspended exit', 'PRESENCE_REPEAT_EXIT:'],
]

export function verifyReport(report, mode, exitCode, runner) {
  assert.ok(runner && Array.isArray(runner.unhandledErrors) && Array.isArray(runner.modules), 'missing runner evidence')
  assert.equal(runner.reason, mode === 'negative' ? 'failed' : 'passed', 'incomplete/invalid runner outcome')
  assert.deepEqual(runner.unhandledErrors, [], 'unhandled runner errors invalidate the probe')
  for (const module of runner.modules)
    assert.deepEqual(module.errors, [], `suite/collection errors: ${module.name}`)
  assert.equal(report.numRuntimeErrorTestSuites ?? 0, 0, 'runtime errors invalidate the probe')
  assert.equal(report.numPendingTests, 0, 'skipped tests invalidate the probe')
  assert.equal(report.numTodoTests ?? 0, 0, 'todo tests invalidate the probe')
  assert.equal(report.unhandledErrors?.length ?? 0, 0, 'unhandled errors invalidate the probe')
  const suites = report.testResults
  assert.ok(Array.isArray(suites) && suites.length > 0, 'missing test results')
  assert.deepEqual(runner.modules.map(module => module.name).sort(), suites.map(suite => suite.name).sort(), 'runner and JSON suites differ')
  for (const suite of suites) {
    assert.equal(suite.message ?? '', '', 'suite failure invalidates the probe')
    assert.ok(suite.assertionResults.length > 0, 'empty suite or collection failure')
  }
  const assertions = suites.flatMap(suite => suite.assertionResults)
  for (const [title] of probes)
    assert.equal(assertions.filter(test => test.title === title).length, 1, `missing/duplicate probe: ${title}`)
  assert.ok(assertions.every(test => ['passed', 'failed'].includes(test.status)), 'incomplete assertion results')
  assert.equal(report.numTotalTests, assertions.length, 'inconsistent test count')

  if (mode === 'negative') {
    assert.equal(exitCode, 1, 'negative control must fail normally (not crash or succeed)')
    assert.equal(report.success, false)
    assert.equal(assertions.length, probes.length, 'negative control must run only the explicit probes')
    const mandatory = assertions.find(test => test.title === probes[0][0])
    assert.equal(mandatory.status, 'failed', 'published 0.2.9 must reproduce the original backdrop defect')
    for (const test of assertions.filter(test => test.status === 'failed')) {
      const marker = probes.find(([title]) => title === test.title)?.[1]
      assert.equal(test.failureMessages.length, 1, `additional failures: ${test.title}`)
      assert.ok(marker && test.failureMessages[0].startsWith(`Error: ${marker}`), `unexpected failure: ${test.title}`)
    }
  }
  else {
    assert.equal(mode, 'positive')
    assert.equal(exitCode, 0, 'candidate Chromium run failed')
    assert.equal(report.success, true)
    assert.equal(report.numFailedTests, 0)
    assert.ok(assertions.every(test => test.status === 'passed'))
    const original = suites.find(suite => suite.name.endsWith('/src/components/tour/test/tour.test.tsx'))
    assert.equal(original?.assertionResults.length, 18, 'all 18 unchanged original Tour tests must run')
    assert.equal(assertions.length, 18 + probes.length, 'positive must run the complete bounded test set')
    assert.ok(assertions.some(test => test.title === 'uses the root presence for content exit animations'), 'original exit assertions must run')
  }
  return { mode, tests: assertions.length, passed: report.numPassedTests, failed: report.numFailedTests }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [, , mode, file, exitCode] = process.argv
  console.log(JSON.stringify(verifyReport(JSON.parse(readFileSync(file, 'utf8')), mode, Number(exitCode), JSON.parse(readFileSync(`${file}.runner.json`, 'utf8'))), null, 2))
}

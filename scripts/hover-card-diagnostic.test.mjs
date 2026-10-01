import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmodSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
// Keep the evidence gate testable without invoking Vitest or a browser.
// eslint-disable-next-line test/no-import-node-test
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { classifyObservation, extractTraces, targetFile, targetSuite, targetTitle, tracePrefix, validateTrace } from './hover-card-diagnostic.mjs'

function testReport(targetStatus = 'passed', otherStatus = 'passed') {
  const assertion = (title, status, ancestorTitles) => ({ title, status, ancestorTitles, fullName: `${ancestorTitles.join(' ')} ${title}` })
  const testResults = [
    { name: `/checkout/${targetFile}`, status: targetStatus, assertionResults: [assertion(targetTitle, targetStatus, [targetSuite])] },
    { name: '/checkout/packages/vue/test/other.test.ts', status: otherStatus, assertionResults: [assertion('unrelated test', otherStatus, ['other suite'])] },
  ]
  testResults[0].assertionResults[0].meta = { hoverCardRawTrace: { enabled: true, machine: { id: 'hover-card', instance: 7, contextId: 'hover-7' }, iterations: 4 } }
  return {
    success: targetStatus === 'passed' && otherStatus === 'passed',
    numTotalTests: 2,
    numFailedTests: [targetStatus, otherStatus].filter(status => status === 'failed').length,
    testResults,
  }
}

function completeTrace() {
  const machine = open => ({
    id: 'hover-card',
    instance: 7,
    value: open ? 'open' : 'closed',
    tags: open ? ['open'] : [],
    event: { type: 'CONTROLLED.OPEN', open },
    previousEvent: { type: 'TRIGGER.POINTER_ENTER' },
    context: { id: 'hover-7', open: null, isPointer: true },
  })
  const entries = [
    { type: 'render', details: { open: true } },
    { type: 'onOpenChange', details: { open: true } },
    { type: 'settled', details: { iteration: 0, open: true } },
    { type: 'request', details: { iteration: 1, open: false } },
    ...['before action', 'after action', 'after act', 'first mismatch', 'failure'].map(type => ({
      type,
      details: {
        iteration: 1,
        open: false,
        apiOpen: true,
        machine: machine(type !== 'after action'),
        ...(type === 'failure' ? { phase: 'state assertion', error: 'AssertionError: expected true to be false // Object.is equality' } : {}),
      },
    })),
  ].map((entry, index) => ({ ...entry, elapsed: index }))
  return { rawTraceEnabled: true, droppedEntries: 0, entries, final: { apiOpen: true, activeElement: null, hovered: [], html: '<button data-state="open">{Trigger}</button>' } }
}

function traceLog(trace = completeTrace()) {
  return `suite start\n${tracePrefix} ${JSON.stringify(trace, null, 2)}\nsuite end\n`
}

function classify(overrides = {}) {
  return classifyObservation({ observation: 1, suiteExitCode: 0, report: testReport(), log: 'full suite passed\n', ...overrides })
}

test('only complete passing observations 1 and 2 permit continuation; three passes remain inconclusive', () => {
  for (const observation of [1, 2]) {
    const result = classify({ observation })
    assert.equal(result.classification, 'pass')
    assert.equal(result.continue, true)
    assert.equal(result.exitCode, 0)
  }
  const result = classify({ observation: 3 })
  assert.equal(result.classification, 'all-pass-inconclusive')
  assert.equal(result.continue, false)
  assert.match(result.reasons[0], /not evidence of a fix/)
  assert.equal(classify({ observation: 4 }).classification, 'infrastructure-failure')
})

test('complete original failure stops immediately and retains the actual nonzero suite code', () => {
  assert.deepEqual(validateTrace(completeTrace()), [])
  const result = classify({ suiteExitCode: 17, report: testReport('failed'), log: traceLog() })
  assert.equal(result.classification, 'complete-target-failure')
  assert.equal(result.continue, false)
  assert.equal(result.suiteExitCode, 17)
  assert.equal(result.exitCode, 17)
  assert.equal(result.failedTests.length, 1)
})

test('native events need not occur, but any observed events and mutations are preserved', () => {
  const trace = completeTrace()
  trace.entries.splice(4, 0, { elapsed: 3, type: 'event', details: { type: 'pointerover', clientX: 50, isTrusted: true } }, { elapsed: 3, type: 'mutation', details: { attribute: 'data-state', value: 'open' } })
  assert.deepEqual(validateTrace(trace), [])
  assert.deepEqual(extractTraces(traceLog(trace)), [trace])
})

test('balanced extraction preserves braces, quotes, escapes, and ANSI-colored logs', () => {
  const trace = completeTrace()
  trace.final.html = '<button title="{escaped \\"}">x</button>'
  assert.deepEqual(extractTraces(`\u001B[31m${traceLog(trace)}\u001B[0m`), [trace])
  assert.deepEqual(extractTraces(`${tracePrefix} {"entries": [`), [undefined])
  assert.equal(extractTraces(`${traceLog()}${traceLog()}`).length, 2)
})

test('missing, truncated, duplicate, or failure-with-zero-exit captures never reopen the gate', () => {
  for (const log of ['no trace', `${tracePrefix} {`, `${traceLog()}${traceLog()}`]) {
    const result = classify({ report: testReport('failed'), suiteExitCode: 1, log })
    assert.equal(result.classification, 'incomplete-target-failure')
    assert.equal(result.continue, false)
    assert.equal(result.exitCode, 1)
  }
  assert.equal(classify({ report: testReport('failed'), log: traceLog() }).classification, 'incomplete-target-failure')
})

test('every required checkpoint must contain a same-instance raw snapshot for the failing iteration', () => {
  for (const type of ['before action', 'after action', 'after act', 'first mismatch', 'failure']) {
    for (const defect of ['missing', 'missing raw', 'wrong instance', 'wrong iteration', 'wrong open', 'missing previousEvent', 'missing context']) {
      const trace = completeTrace()
      const index = trace.entries.findIndex(entry => entry.type === type)
      const details = trace.entries[index].details
      if (defect === 'missing')
        trace.entries.splice(index, 1)
      else if (defect === 'missing raw')
        delete details.machine
      else if (defect === 'wrong instance')
        details.machine.instance = 99
      else if (defect === 'wrong iteration')
        details.iteration = 3
      else if (defect === 'wrong open')
        details.open = true
      else if (defect === 'missing previousEvent')
        delete details.machine.previousEvent
      else if (defect === 'missing context')
        delete details.machine.context.open
      const result = classify({ report: testReport('failed'), suiteExitCode: 1, log: traceLog(trace) })
      assert.equal(result.classification, 'incomplete-target-failure', `${type}: ${defect}`)
      assert.equal(result.continue, false)
    }
  }
})

test('dropped entries, wrong symptom, wrong phase, and malformed raw fields are incomplete', () => {
  const defects = [
    trace => trace.droppedEntries++,
    trace => trace.rawTraceEnabled = false,
    trace => delete trace.final.html,
    trace => trace.entries.find(entry => entry.type === 'first mismatch').details.apiOpen = false,
    trace => trace.entries.find(entry => entry.type === 'failure').details.phase = 'callback assertion',
    trace => trace.entries.find(entry => entry.type === 'failure').details.error = 'expected closed to be open',
    trace => trace.entries.find(entry => entry.type === 'after action').details.machine.event = { noType: 'x' },
    trace => trace.entries.find(entry => entry.type === 'after action').details.machine.tags = null,
    trace => trace.entries.find(entry => entry.type === 'after action').details.machine.context.id = 'another-id',
    trace => trace.entries.find(entry => entry.type === 'after action').elapsed = 100,
    trace => trace.entries = trace.entries.filter(entry => entry.type !== 'request'),
    trace => trace.entries = trace.entries.filter(entry => entry.type !== 'settled'),
  ]
  for (const defect of defects) {
    const trace = completeTrace()
    defect(trace)
    assert.equal(classify({ report: testReport('failed'), suiteExitCode: 1, log: traceLog(trace) }).classification, 'incomplete-target-failure')
  }
})

test('unrelated assertion failures retain their status while allowing bounded target observations', () => {
  const result = classify({ suiteExitCode: 9, report: testReport('passed', 'failed') })
  assert.equal(result.classification, 'unrelated-suite-failure')
  assert.equal(result.continue, true)
  assert.equal(result.allSuitesPassed, false)
  assert.equal(result.exitCode, 9)
  const complete = classify({ suiteExitCode: 9, report: testReport('failed', 'failed'), log: traceLog() })
  assert.equal(complete.classification, 'complete-target-failure')
  assert.equal(complete.failedTests.length, 2)
  assert.equal(complete.exitCode, 9)
  assert.equal(complete.continue, false)
  assert.equal(classify({ observation: 3, suiteExitCode: 9, report: testReport('passed', 'failed') }).continue, false)
  const finalPass = classify({ observation: 3, priorSuitesPassed: false })
  assert.equal(finalPass.classification, 'target-pass-inconclusive')
  assert.equal(finalPass.allSuitesPassed, false)
  assert.equal(finalPass.exitCode, 0)
})

test('nested detached event ancestry and a postfailure API change remain valid evidence', () => {
  const trace = completeTrace()
  trace.entries.find(entry => entry.type === 'after action').details.machine.event = { type: 'x', previousEvent: { type: 'y', point: [1, 2], previousEvent: null } }
  trace.final.apiOpen = false
  assert.deepEqual(validateTrace(trace), [])
})

test('a passed target requires valid opt-in capture metadata; skipped unrelated files are allowed', () => {
  for (const marker of [undefined, {}, { enabled: false }, { enabled: true, iterations: 4, machine: { id: 'hover-card', instance: 0, contextId: '' } }]) {
    const report = testReport()
    report.testResults[0].assertionResults[0].meta = { hoverCardRawTrace: marker }
    assert.equal(classify({ report }).classification, 'infrastructure-failure')
  }
  const report = testReport()
  report.testResults[1].status = 'skipped'
  report.testResults[1].assertionResults[0].status = 'skipped'
  assert.equal(classify({ report }).classification, 'pass')
})

test('unhandled/runtime failures always block, including when the exact target passed', () => {
  for (const log of ['⎯⎯⎯ Unhandled Errors ⎯⎯⎯', '  Errors  1 error', 'Vitest caught 1 unhandled error during the test run'])
    assert.equal(classify({ log, suiteExitCode: 1 }).classification, 'infrastructure-failure')
  const report = testReport('passed', 'failed')
  report.testResults[1].message = 'beforeAll could not start the browser'
  assert.equal(classify({ report, suiteExitCode: 1 }).classification, 'infrastructure-failure')
})

test('setup, missing report, incomplete inventory, skipped target, and unexplained nonzero exit are infrastructure failures', () => {
  const wrongTarget = testReport()
  wrongTarget.testResults[0].name = '/checkout/diagnostics/hover-card-predecessor.probe.tsx'
  const wrongCount = testReport()
  wrongCount.numTotalTests++
  for (const overrides of [
    { stepOutcomes: { install: { outcome: 'failure' } } },
    { stepOutcomes: { suite: { outcome: 'cancelled' } }, suiteExitCode: null },
    { report: undefined },
    { report: wrongTarget },
    { report: wrongCount },
    { report: testReport('skipped') },
    { suiteExitCode: 124 },
    { logExitCode: 1 },
    { log: '' },
  ]) {
    const result = classify(overrides)
    assert.equal(result.classification, 'infrastructure-failure')
    assert.equal(result.continue, false)
    assert.notEqual(result.exitCode, 0)
  }
})

test('CLI saves a classification and GitHub gate outputs before returning a suite failure', (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'hover-classifier-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  writeFileSync(join(directory, 'test-results.json'), JSON.stringify(testReport('failed')))
  writeFileSync(join(directory, 'suite.log'), traceLog())
  const output = join(directory, 'outputs.txt')
  const child = spawnSync(process.execPath, [fileURLToPath(new URL('./hover-card-diagnostic.mjs', import.meta.url))], {
    env: { ...process.env, EVIDENCE_DIR: directory, OBSERVATION: '1', SUITE_EXIT_CODE: '23', LOG_EXIT_CODE: '0', GITHUB_OUTPUT: output },
    encoding: 'utf8',
  })
  assert.equal(child.status, 23, child.stderr)
  const result = JSON.parse(readFileSync(join(directory, 'classification.json'), 'utf8'))
  assert.equal(result.classification, 'complete-target-failure')
  assert.equal(result.suiteExitCode, 23)
  assert.match(readFileSync(output, 'utf8'), /continue=false\nclassification=complete-target-failure\n/)
})

test('CLI preserves setup-failure evidence even when no tests or JSON report exist', (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'hover-setup-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const output = join(directory, 'outputs.txt')
  const child = spawnSync(process.execPath, [fileURLToPath(new URL('./hover-card-diagnostic.mjs', import.meta.url))], {
    env: { ...process.env, EVIDENCE_DIR: directory, OBSERVATION: '1', SUITE_EXIT_CODE: '', LOG_EXIT_CODE: '', STEP_OUTCOMES: '{"install":{"outcome":"failure"}}', GITHUB_OUTPUT: output },
    encoding: 'utf8',
  })
  assert.equal(child.status, 1, child.stderr)
  const result = JSON.parse(readFileSync(join(directory, 'classification.json'), 'utf8'))
  assert.equal(result.classification, 'infrastructure-failure')
  assert.equal(result.artifacts.testReport, false)
  assert.match(readFileSync(output, 'utf8'), /continue=false/)
})

test('actual workflow suite shell retains the pnpm exit code through tee and records the unchanged full-suite command', (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'hover-workflow-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const workflow = readFileSync(new URL('../.github/workflows/hover-card-observation.yml', import.meta.url), 'utf8')
  const script = workflow.match(/ {6}- name: Observe original full suite once, without retries[\s\S]*? {8}run: \|\n([\s\S]*?)(?=\n {6}- name:)/)[1].replace(/^ {10}/gm, '')
  const pnpm = join(directory, 'pnpm')
  writeFileSync(pnpm, '#!/usr/bin/env node\nprocess.stdout.write(JSON.stringify(process.argv.slice(2)) + "\\n")\nprocess.stderr.write("simulated full-suite failure\\n")\nprocess.exit(17)\n')
  chmodSync(pnpm, 0o755)
  const output = join(directory, 'outputs.txt')
  const child = spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', script], {
    env: { ...process.env, PATH: `${directory}:${process.env.PATH}`, EVIDENCE_DIR: directory, GITHUB_OUTPUT: output },
    encoding: 'utf8',
  })
  assert.equal(child.status, 17, child.stderr)
  const log = readFileSync(join(directory, 'suite.log'), 'utf8')
  const args = JSON.parse(log.split('\n')[0])
  assert.deepEqual(args, ['run', 'test:ci', '--retry=0', '--reporter=default', '--reporter=json', `--outputFile.json=${directory}/test-results.json`])
  assert.match(log, /simulated full-suite failure/)
  assert.equal(readFileSync(join(directory, 'suite-exit-code.txt'), 'utf8'), '17\n')
  assert.match(readFileSync(output, 'utf8'), /exit-code=17\nlog-exit-code=0\n/)
})

test('the final gate checks cancellation in the allowed if context and requires saved eligible evidence', (context) => {
  const directory = mkdtempSync(join(tmpdir(), 'hover-gate-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const workflow = readFileSync(new URL('../.github/workflows/hover-card-observation.yml', import.meta.url), 'utf8')
  const gate = workflow.match(/ {6}- name: Open the next observation gate[\s\S]*$/)[0]
  // GitHub permits status functions in step `if`, but rejects them in `env`.
  // A cancelled run skips this step and therefore cannot emit continue=true.
  assert.match(gate, /^ {8}if: \$\{\{ always\(\) && !cancelled\(\) \}\}$/m)
  assert.doesNotMatch(gate, /^ {10}[A-Z_]+:.*cancelled\(\)/m)
  const script = gate.match(/ {8}run: \|\n([\s\S]*)$/)[1].replace(/^ {10}/gm, '')
  for (const [mayContinue, artifactOutcome, expected] of [
    ['true', 'success', true],
    ['true', 'failure', false],
    ['false', 'success', false],
    ['', 'success', false],
  ]) {
    const output = join(directory, 'outputs.txt')
    writeFileSync(output, '')
    const child = spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', script], {
      env: { ...process.env, GITHUB_OUTPUT: output, MAY_CONTINUE: mayContinue, ARTIFACT_OUTCOME: artifactOutcome },
      encoding: 'utf8',
    })
    assert.equal(child.status, 0, child.stderr)
    assert.equal(readFileSync(output, 'utf8'), `continue=${expected}\n`)
  }
})

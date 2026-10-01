import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { stripVTControlCharacters } from 'node:util'

export const targetFile = 'packages/react/src/hooks/test/controllable-migration.test.tsx'
export const targetSuite = 'undefined live open preserves uncontrolled ownership'
export const targetTitle = 'hover-card: opens and closes twice, including API and DOM state'
export const tracePrefix = '[hover-card open-state trace]'

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

function scalar(value) {
  return value === null || ['string', 'boolean'].includes(typeof value) || (typeof value === 'number' && Number.isFinite(value))
}

function jsonValue(value, depth = 0) {
  if (scalar(value))
    return true
  return depth < 32 && (Array.isArray(value) || object(value)) && Object.values(value).every(child => jsonValue(child, depth + 1))
}

function event(value) {
  return value === null || (object(value) && typeof value.type === 'string' && jsonValue(value))
}

function machine(value) {
  return object(value) && value.id === 'hover-card'
    && Number.isInteger(value.instance) && value.instance > 0
    && typeof value.value === 'string'
    && Array.isArray(value.tags) && value.tags.every(tag => typeof tag === 'string')
    && Object.hasOwn(value, 'event') && event(value.event)
    && Object.hasOwn(value, 'previousEvent') && event(value.previousEvent)
    && object(value.context) && typeof value.context.id === 'string'
    && ['open', 'isPointer'].every(key => Object.hasOwn(value.context, key) && (value.context[key] === null || typeof value.context[key] === 'boolean'))
}

// Browser console output contains a pretty-printed JSON string. A balanced
// scanner tolerates braces in HTML/errors without swallowing later log lines.
export function extractTraces(log) {
  const text = stripVTControlCharacters(log)
  const captures = []
  let cursor = 0
  while (cursor < text.length) {
    cursor = text.indexOf(tracePrefix, cursor)
    if (cursor === -1)
      break
    cursor += tracePrefix.length
    const nextMarker = text.indexOf(tracePrefix, cursor)
    const tail = text.slice(cursor, nextMarker < 0 ? undefined : nextMarker).trimStart()
    let quoted = false
    let escaped = false
    let depth = 0
    let report
    if (tail.startsWith('{')) {
      for (let index = 0; index < tail.length; index++) {
        const char = tail[index]
        if (quoted) {
          if (escaped)
            escaped = false
          else if (char === '\\')
            escaped = true
          else if (char === '"')
            quoted = false
        }
        else if (char === '"') {
          quoted = true
        }
        else if (char === '{') {
          depth++
        }
        else if (char === '}' && --depth === 0) {
          try {
            report = JSON.parse(tail.slice(0, index + 1))
          }
          catch {}
          break
        }
      }
    }
    captures.push(report)
  }
  return captures
}

export function validateTrace(report) {
  const reasons = []
  if (!object(report) || report.rawTraceEnabled !== true)
    return ['Raw machine tracing is absent or disabled']
  if (report.droppedEntries !== 0)
    reasons.push('The trace dropped entries or has no dropped-entry count')
  if (!object(report.final) || typeof report.final.apiOpen !== 'boolean' || typeof report.final.html !== 'string'
    || !Object.hasOwn(report.final, 'activeElement') || !Array.isArray(report.final.hovered)) {
    reasons.push('The final API/DOM snapshot is incomplete')
  }
  if (!Array.isArray(report.entries) || !report.entries.length)
    return [...reasons, 'Trace entries are missing']
  const entries = report.entries
  if (entries.some((entry, index) => !object(entry) || !Number.isFinite(entry.elapsed) || entry.elapsed < 0
    || (index > 0 && entry.elapsed < entries[index - 1].elapsed) || typeof entry.type !== 'string' || !object(entry.details))) {
    return [...reasons, 'Trace entries are malformed or out of order']
  }
  const failures = entries.filter(entry => entry.type === 'failure')
  if (failures.length !== 1)
    return [...reasons, 'Expected exactly one failure checkpoint']
  const failure = failures[0].details
  if (failure.phase !== 'state assertion' || failure.open !== false || ![1, 3].includes(failure.iteration)
    || typeof failure.error !== 'string' || !failure.error) {
    reasons.push('Failure is not the original uncontrolled-close state assertion')
  }
  if (!/expected true to be false/.test(failure.error ?? ''))
    reasons.push('Failure does not show the original expected-false/actual-true API symptom')
  const checkpoints = ['before action', 'after action', 'after act', 'first mismatch', 'failure']
  let previousIndex = -1
  let instance
  let contextId
  for (const type of checkpoints) {
    const matches = entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => entry.type === type
      && entry.details.iteration === failure.iteration && entry.details.open === failure.open)
    if (matches.length !== 1) {
      reasons.push(`Expected one ${type} checkpoint for the failing iteration`)
      continue
    }
    const { entry, index } = matches[0]
    if (type === 'first mismatch' && entry.details.apiOpen !== true)
      reasons.push('The first mismatch does not show API open after a close request')
    if (index <= previousIndex)
      reasons.push(`${type} is out of checkpoint order`)
    previousIndex = index
    if (!machine(entry.details.machine)) {
      reasons.push(`${type} has an incomplete raw machine snapshot`)
      continue
    }
    instance ??= entry.details.machine.instance
    contextId ??= entry.details.machine.context.id
    if (entry.details.machine.instance !== instance || entry.details.machine.context.id !== contextId)
      reasons.push(`${type} belongs to a different machine instance`)
  }
  for (const type of ['render', 'onOpenChange', 'settled']) {
    if (!entries.some(entry => entry.type === type))
      reasons.push(`Missing ${type} evidence`)
  }
  if (!entries.some(entry => entry.type === 'request' && entry.details.iteration === failure.iteration && entry.details.open === false))
    reasons.push('Missing the failing close request')
  // Native event/mutation entries are retained when observed; their absence
  // can itself be evidence and does not invalidate a complete capture.
  return reasons
}

export function classifyObservation({ observation, suiteExitCode, logExitCode = 0, stepOutcomes = {}, report, log = '', priorSuitesPassed = true }) {
  const result = (classification, reasons, extra = {}) => ({
    observation,
    classification,
    continue: ['pass', 'unrelated-suite-failure'].includes(classification) && observation < 3,
    allSuitesPassed: (priorSuitesPassed && classification === 'pass') || classification === 'all-pass-inconclusive',
    suiteExitCode,
    exitCode: Number.isInteger(suiteExitCode) && suiteExitCode !== 0 ? suiteExitCode : ['pass', 'all-pass-inconclusive', 'target-pass-inconclusive'].includes(classification) ? 0 : 1,
    reasons,
    ...extra,
  })
  const infrastructure = []
  if (![1, 2, 3].includes(observation))
    infrastructure.push('Observation must be between 1 and 3')
  for (const name of ['checkout', 'provenance', 'node', 'pnpm', 'install', 'browsers']) {
    if (stepOutcomes[name] && stepOutcomes[name].outcome !== 'success')
      infrastructure.push(`${name} did not succeed (${stepOutcomes[name].outcome})`)
  }
  if (!Number.isInteger(suiteExitCode) || suiteExitCode < 0 || suiteExitCode > 255)
    infrastructure.push('The suite did not finish with a recorded exit code')
  if (logExitCode !== 0 || !log.trim())
    infrastructure.push('The full suite log is missing or could not be saved')
  if (!object(report) || !Array.isArray(report.testResults) || !report.testResults.length
    || report.testResults.some(file => !object(file) || !Array.isArray(file.assertionResults))
    || !Number.isInteger(report.numTotalTests) || report.numTotalTests < 1
    || !Number.isInteger(report.numFailedTests) || typeof report.success !== 'boolean') {
    infrastructure.push('The JSON test report is missing, malformed, or empty')
  }
  if (infrastructure.length)
    return result('infrastructure-failure', infrastructure)

  const plainLog = stripVTControlCharacters(log)
  if (/^\s*(?:[━─⎯-]+\s*)?Unhandled Errors(?:\s|$)/m.test(plainLog)
    || /^\s*Errors\s+[1-9]\d*\s+errors?\b/m.test(plainLog)
    || /Vitest caught [1-9]\d* unhandled error/.test(plainLog)
    || report.testResults.some(file => typeof file.message === 'string' && file.message.trim())) {
    return result('infrastructure-failure', ['Vitest reported an unhandled/runtime or test-file setup error'])
  }

  const assertions = report.testResults.flatMap(file => Array.isArray(file.assertionResults) ? file.assertionResults.map(test => ({ ...test, file: file.name })) : [])
  const failed = assertions.filter(test => test.status === 'failed')
  if (assertions.length !== report.numTotalTests || failed.length !== report.numFailedTests)
    return result('infrastructure-failure', ['JSON test counts do not match recorded assertions'])
  const targets = assertions.filter(test => typeof test.file === 'string' && test.file.replaceAll('\\', '/').endsWith(`/${targetFile}`)
    && test.title === targetTitle && Array.isArray(test.ancestorTitles) && test.ancestorTitles.includes(targetSuite))
  if (targets.length !== 1 || !['passed', 'failed'].includes(targets[0].status))
    return result('infrastructure-failure', ['The exact original HoverCard target was not observed once to completion'])
  const captures = extractTraces(log)
  const evidence = { targetStatus: targets[0].status, failedTests: failed.map(test => ({ file: test.file, title: test.fullName ?? test.title })), traceCount: captures.length }
  if (targets[0].status === 'failed') {
    const reasons = captures.length === 1 ? validateTrace(captures[0]) : ['Expected exactly one failure-only trace in the full log']
    if (suiteExitCode === 0)
      reasons.push('The failed target unexpectedly had suite exit code zero')
    return result(reasons.length ? 'incomplete-target-failure' : 'complete-target-failure', reasons.length ? reasons : ['Complete original uncontrolled-close failure captured; stop observing'], evidence)
  }
  if (captures.length)
    return result('incomplete-target-failure', ['A failure trace exists without a failed original target'], evidence)
  const marker = targets[0].meta?.hoverCardRawTrace
  if (!object(marker) || marker.enabled !== true || marker.iterations !== 4 || !object(marker.machine)
    || marker.machine.id !== 'hover-card' || !Number.isInteger(marker.machine.instance) || marker.machine.instance < 1
    || typeof marker.machine.contextId !== 'string' || !marker.machine.contextId) {
    return result('infrastructure-failure', ['The passed target lacks proof that raw machine capture covered all four original iterations'], evidence)
  }
  if (suiteExitCode !== 0 || report.success !== true || failed.length || report.testResults.some(file => !['passed', 'skipped'].includes(file.status))) {
    if (!failed.length || suiteExitCode === 0 || report.success !== false
      || report.testResults.some(file => file.status === 'failed' && !file.assertionResults.some(test => test.status === 'failed'))) {
      return result('infrastructure-failure', ['The full suite failed without a consistent assertion-failure report'], evidence)
    }
    return result('unrelated-suite-failure', [observation < 3
      ? 'The observed target passed; unrelated assertion failures remain failures. One bounded next observation may run.'
      : 'The target passed but unrelated assertions failed. The three-observation limit is reached; this is inconclusive.'], evidence)
  }
  return result(observation === 3 ? priorSuitesPassed ? 'all-pass-inconclusive' : 'target-pass-inconclusive' : 'pass', [observation === 3
    ? priorSuitesPassed
      ? 'All three independent observations passed. This is inconclusive and is not evidence of a fix.'
      : 'The target passed in all three observations, with earlier unrelated suite failures retained. This is inconclusive.'
    : 'This independent full-suite observation passed; the bounded next observation may run.'], evidence)
}

function readIfPresent(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

export function run(env = process.env) {
  const directory = env.EVIDENCE_DIR ?? 'hover-card-evidence'
  mkdirSync(directory, { recursive: true })
  let report
  let stepOutcomes = {}
  try {
    report = JSON.parse(readIfPresent(join(directory, 'test-results.json')))
  }
  catch {}
  try {
    stepOutcomes = JSON.parse(env.STEP_OUTCOMES ?? '{}')
  }
  catch {
    stepOutcomes = { checkout: { outcome: 'unknown' } }
  }
  const result = classifyObservation({
    observation: Number(env.OBSERVATION),
    priorSuitesPassed: env.PRIOR_SUITES_PASSED !== 'false',
    suiteExitCode: env.SUITE_EXIT_CODE ? Number(env.SUITE_EXIT_CODE) : null,
    logExitCode: env.LOG_EXIT_CODE ? Number(env.LOG_EXIT_CODE) : null,
    stepOutcomes,
    report,
    log: readIfPresent(join(directory, 'suite.log')),
  })
  result.artifacts = { suiteLog: existsSync(join(directory, 'suite.log')), testReport: existsSync(join(directory, 'test-results.json')) }
  writeFileSync(join(directory, 'classification.json'), `${JSON.stringify(result, null, 2)}\n`)
  if (env.GITHUB_OUTPUT)
    appendFileSync(env.GITHUB_OUTPUT, `continue=${result.continue}\nclassification=${result.classification}\nall-suites-passed=${result.allSuitesPassed}\n`)
  if (env.GITHUB_STEP_SUMMARY)
    appendFileSync(env.GITHUB_STEP_SUMMARY, `Observation ${result.observation}/3: **${result.classification}**\n\n${result.reasons.join('\n\n')}\n\nSuite exit code: ${result.suiteExitCode ?? 'not recorded'}. Evidence is in the observation artifact.\n`)
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
  return result.exitCode
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  process.exitCode = run()

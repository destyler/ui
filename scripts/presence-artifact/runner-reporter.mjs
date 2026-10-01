import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import process from 'node:process'

// Vitest 4's JSON reporter omits unhandled errors. Record its actual runner API
// separately so an expected assertion failure cannot conceal another failure.
export default class PresenceRunnerReporter {
  onTestRunEnd(testModules, unhandledErrors, reason) {
    assert.ok(process.env.PRESENCE_RUNNER_REPORT, 'PRESENCE_RUNNER_REPORT is required')
    writeFileSync(process.env.PRESENCE_RUNNER_REPORT, `${JSON.stringify({
      reason,
      unhandledErrors,
      modules: testModules.map(module => ({
        name: module.moduleId,
        errors: [...module.errors(), ...[...module.children.allSuites()].flatMap(suite => suite.errors())],
      })),
    }, null, 2)}\n`)
  }
}

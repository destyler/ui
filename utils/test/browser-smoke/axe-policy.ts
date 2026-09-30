import type { AxeResults, Result } from 'axe-core'

export type ScanResults = Pick<AxeResults, 'violations' | 'incomplete'> & { error?: unknown }

function hasError(value: object) {
  return 'error' in value
}

// axe cannot establish a JavaScript modal's keyboard trap. Admit only its
// precise review result, and only after the real keyboard assertions passed.
export function isModalFocusReview(result: Result): boolean {
  return !hasError(result)
    && result.id === 'aria-hidden-focus'
    && result.nodes.length > 0
    && result.nodes.every(node => !hasError(node)
      && node.all.length === 1
      && node.all[0].id === 'focusable-modal-open'
      && !hasError(node.all[0])
      && node.any.length === 0
      && node.none.length === 0)
}

export function assertAxeResults(results: ScanResults, modalKeyboardTrapVerified = false): Result[] {
  if (hasError(results))
    throw new Error(`axe scan error: ${String(results.error)}`)

  if (results.violations.length > 0)
    throw new Error(`axe violations: ${JSON.stringify(results.violations, null, 2)}`)

  const unexpected = results.incomplete.filter(result => !(modalKeyboardTrapVerified && isModalFocusReview(result)))
  if (unexpected.length > 0)
    throw new Error(`axe incomplete results require review: ${JSON.stringify(unexpected, null, 2)}`)

  return results.incomplete
}

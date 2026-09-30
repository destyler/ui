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

export interface ReviewContext {
  modalKeyboardTrapVerified?: boolean
  closedDialog?: ClosedDialogRelation
}

export function assertAxeResults(results: ScanResults, context: ReviewContext = {}): Result[] {
  if (hasError(results))
    throw new Error(`axe scan error: ${String(results.error)}`)

  if (results.violations.length > 0)
    throw new Error(`axe violations: ${JSON.stringify(results.violations, null, 2)}`)

  const unexpected = results.incomplete.filter(result => !(context.modalKeyboardTrapVerified && isModalFocusReview(result))
    && !(results.incomplete.length === 1 && isClosedDialogControlsReview(result, context.closedDialog)))
  if (unexpected.length > 0)
    throw new Error(`axe incomplete results require review: ${JSON.stringify(unexpected, null, 2)}`)

  return results.incomplete
}

export interface ClosedDialogRelation {
  trigger: Element
  content: Element
}

// axe-core 4.11.0 ariaValidAttrValueEvaluate marks popup controls for review
// even when the IDREF exists. Only this tested, closed Dialog relation qualifies.
export function isClosedDialogControlsReview(result: Result, relation?: ClosedDialogRelation): boolean {
  if (!relation || hasError(result) || result.id !== 'aria-valid-attr-value' || result.nodes.length !== 1)
    return false

  const node = result.nodes[0]
  if (hasError(node) || node.all.length !== 1 || node.any.length !== 0 || node.none.length !== 0)
    return false
  const check = node.all[0]
  if (hasError(check) || check.id !== 'aria-valid-attr-value' || !Array.isArray(check.relatedNodes) || check.relatedNodes.length !== 0)
    return false
  if (!check.data || Object.keys(check.data).sort().join(',') !== 'messageKey,needsReview')
    return false

  const { trigger, content } = relation
  const document = trigger.ownerDocument
  if (!trigger.isConnected || !content.isConnected || content.ownerDocument !== document || !document.body.contains(trigger) || !document.body.contains(content))
    return false
  if (!content.id || !trigger.id || /\s/.test(content.id) || /\s/.test(trigger.id) || document.activeElement !== trigger)
    return false
  // axe 4.11.0 keeps one mutable review message per check. Restrict the
  // trigger's ARIA attributes so controlsWithinPopup cannot mask another review.
  const ariaAttributes = Array.from(trigger.attributes).map(attribute => attribute.name).filter(name => name.startsWith('aria-')).sort()
  if (ariaAttributes.join(',') !== 'aria-controls,aria-expanded,aria-haspopup')
    return false
  if (trigger.tagName !== 'BUTTON' || ![null, 'button'].includes(trigger.getAttribute('role')) || trigger.getAttribute('data-scope') !== 'dialog' || trigger.getAttribute('data-part') !== 'trigger')
    return false
  if (trigger.getAttribute('aria-haspopup') !== 'dialog' || trigger.getAttribute('aria-expanded') !== 'false' || trigger.getAttribute('data-state') !== 'closed')
    return false
  if (trigger.closest('[hidden], [aria-hidden="true"]') || trigger.getAttribute('aria-controls') !== content.id)
    return false
  if (content.getAttribute('role') !== 'dialog' || content.getAttribute('aria-modal') !== 'true' || content.getAttribute('data-scope') !== 'dialog' || content.getAttribute('data-part') !== 'content')
    return false
  if (!content.hasAttribute('hidden') || content.getAttribute('data-state') !== 'closed')
    return false
  // Reject duplicate IDs instead of letting getElementById mask a bad relation.
  const ids = Array.from(document.querySelectorAll('[id]'))
  if (ids.filter(element => element.id === content.id).length !== 1 || ids.filter(element => element.id === trigger.id).length !== 1)
    return false
  if (check.data.messageKey !== 'controlsWithinPopup' || check.data.needsReview !== `aria-controls="${content.id}"`)
    return false
  if (node.target.length !== 1 || typeof node.target[0] !== 'string')
    return false
  try {
    const targets = document.querySelectorAll(node.target[0])
    return targets.length === 1 && targets[0] === trigger
  }
  catch {
    return false
  }
}

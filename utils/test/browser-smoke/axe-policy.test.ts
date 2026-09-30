import type { Result } from 'axe-core'
import type { ClosedDialogRelation, ScanResults } from './axe-policy'
import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'
import { assertAxeResults } from './axe-policy'

function modalReview(): Result {
  return {
    id: 'aria-hidden-focus',
    nodes: [{
      all: [{ id: 'focusable-modal-open' }],
      any: [],
      none: [],
    }],
  } as unknown as Result
}

function scan(result = modalReview()): ScanResults {
  return { violations: [], incomplete: [result] }
}

describe('browser smoke axe policy', () => {
  it('accepts a clean result without a modal exception', () => {
    expect(assertAxeResults({ violations: [], incomplete: [] })).toEqual([])
  })

  it('requires keyboard trap verification before admitting modal review', () => {
    expect(() => assertAxeResults(scan())).toThrow('incomplete')
    expect(assertAxeResults(scan(), { modalKeyboardTrapVerified: true })).toHaveLength(1)
  })

  it('never suppresses a violation, including the modal rule', () => {
    expect(() => assertAxeResults({ violations: [modalReview()], incomplete: [] }, { modalKeyboardTrapVerified: true })).toThrow('violations')
  })

  it.each(['all', 'any', 'none'] as const)('rejects extra %s checks', (group) => {
    const result = modalReview()
    result.nodes[0][group].push({ id: 'another-check' } as Result['nodes'][number]['all'][number])
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects even duplicate modal checks', () => {
    const result = modalReview()
    result.nodes[0].all.push(result.nodes[0].all[0])
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it.each(['all', 'any', 'none'] as const)('rejects errors in %s checks', (group) => {
    const result = modalReview()
    const check = { ...result.nodes[0].all[0], error: new Error('check failed') }
    result.nodes[0][group] = [check]
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects a rule error', () => {
    const result = Object.assign(modalReview(), { error: new Error('rule failed') })
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects a node error', () => {
    const result = modalReview()
    Object.assign(result.nodes[0], { error: new Error('node failed') })
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects a root scan error', () => {
    expect(() => assertAxeResults({ ...scan(), error: new Error('scan failed') }, { modalKeyboardTrapVerified: true })).toThrow('scan error')
  })

  it('rejects any unexpected rule alongside a permitted one', () => {
    const unexpected = { ...modalReview(), id: 'aria-valid-attr' }
    expect(() => assertAxeResults({ violations: [], incomplete: [modalReview(), unexpected] }, { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects missing modal checks', () => {
    const result = modalReview()
    result.nodes[0].all = []
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects a different check for the same rule', () => {
    const result = modalReview()
    result.nodes[0].all[0].id = 'focusable-content'
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('rejects empty nodes', () => {
    expect(() => assertAxeResults(scan({ ...modalReview(), nodes: [] }), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })

  it('requires every node to match the exact review shape', () => {
    const result = modalReview()
    result.nodes.push({ ...result.nodes[0], any: [{ id: 'extra-check' }] } as Result['nodes'][number])
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
  })
})

function closedDialogReview() {
  const document = new Window().document as unknown as Document
  document.body.innerHTML = '<button id="trigger" data-scope="dialog" data-part="trigger" data-state="closed" aria-haspopup="dialog" aria-expanded="false" aria-controls="content">Open</button><div id="content" data-scope="dialog" data-part="content" data-state="closed" role="dialog" aria-modal="true" hidden>Content</div>'
  const trigger = document.getElementById('trigger')!
  const content = document.getElementById('content')!
  trigger.focus()
  const relation: ClosedDialogRelation = { trigger, content }
  const result = {
    id: 'aria-valid-attr-value',
    nodes: [{
      target: ['#trigger'],
      all: [{
        id: 'aria-valid-attr-value',
        data: { messageKey: 'controlsWithinPopup', needsReview: 'aria-controls="content"' },
        relatedNodes: [],
      }],
      any: [],
      none: [],
    }],
  } as unknown as Result
  return { result, relation, document }
}

describe('closed Dialog popup-controls review', () => {
  it('requires the actual closed relation, not the modal-focus allowance', () => {
    const { result, relation } = closedDialogReview()
    expect(() => assertAxeResults(scan(result))).toThrow('incomplete')
    expect(() => assertAxeResults(scan(result), { modalKeyboardTrapVerified: true })).toThrow('incomplete')
    expect(assertAxeResults(scan(result), { closedDialog: relation })).toEqual([result])
  })

  const invalidShapes: [string, (result: Result) => void][] = [
    ['unexpected rule', result => result.id = 'aria-valid-attr'],
    ['unexpected check', result => result.nodes[0].all[0].id = 'other-check'],
    ['extra all check', result => result.nodes[0].all.push(result.nodes[0].all[0])],
    ['extra any check', result => result.nodes[0].any.push(result.nodes[0].all[0])],
    ['extra none check', result => result.nodes[0].none.push(result.nodes[0].all[0])],
    ['extra node', result => result.nodes.push(result.nodes[0])],
    ['empty nodes', result => result.nodes = []],
    ['rule error', result => Object.assign(result, { error: 'failed' })],
    ['node error', result => Object.assign(result.nodes[0], { error: 'failed' })],
    ['check error', result => Object.assign(result.nodes[0].all[0], { error: 'failed' })],
    ['different message key', result => result.nodes[0].all[0].data.messageKey = 'noId'],
    ['different review ID', result => result.nodes[0].all[0].data.needsReview = 'aria-controls="missing"'],
    ['extra review data', result => result.nodes[0].all[0].data.extra = 'unknown'],
    ['missing related nodes', result => delete result.nodes[0].all[0].relatedNodes],
    ['extra related node', result => result.nodes[0].all[0].relatedNodes!.push({ target: ['#content'], html: '' })],
    ['different target', result => result.nodes[0].target = ['#content']],
    ['nonunique target', result => result.nodes[0].target = ['[id]']],
    ['extra target', result => result.nodes[0].target.push('#content')],
    ['invalid selector', result => result.nodes[0].target = ['[']],
  ]
  it.each(invalidShapes)('rejects %s', (_, invalidate) => {
    const { result, relation } = closedDialogReview()
    invalidate(result)
    expect(() => assertAxeResults(scan(result), { closedDialog: relation })).toThrow('incomplete')
  })

  const invalidRelations: [string, (relation: ClosedDialogRelation, document: Document) => void][] = [
    ['missing target', relation => relation.content.remove()],
    ['detached trigger', relation => relation.trigger.remove()],
    ['wrong controls ID', relation => relation.trigger.setAttribute('aria-controls', 'missing')],
    ['multiple controls IDs', relation => relation.trigger.setAttribute('aria-controls', 'content other')],
    ['empty content ID', relation => relation.content.removeAttribute('id')],
    ['extra unresolved describedby', relation => relation.trigger.setAttribute('aria-describedby', 'missing')],
    ['extra unknown current value', relation => relation.trigger.setAttribute('aria-current', 'unknown')],
    ['additional otherwise-valid ARIA', relation => relation.trigger.setAttribute('aria-label', 'Open')],
    ['wrong trigger role', relation => relation.trigger.setAttribute('role', 'link')],
    ['non-modal target', relation => relation.content.setAttribute('aria-modal', 'false')],
    ['wrong target role', relation => relation.content.setAttribute('role', 'menu')],
    ['visible target', relation => relation.content.removeAttribute('hidden')],
    ['open target', relation => relation.content.setAttribute('data-state', 'open')],
    ['expanded trigger', relation => relation.trigger.setAttribute('aria-expanded', 'true')],
    ['wrong popup role', relation => relation.trigger.setAttribute('aria-haspopup', 'menu')],
    ['hidden trigger', relation => relation.trigger.setAttribute('hidden', '')],
    ['aria-hidden trigger', relation => relation.trigger.setAttribute('aria-hidden', 'true')],
    ['wrong trigger part', relation => relation.trigger.setAttribute('data-part', 'other')],
    ['wrong content part', relation => relation.content.setAttribute('data-part', 'other')],
    ['lost restored focus', (_, document) => (document.activeElement as HTMLElement).blur()],
    ['duplicate content ID', (relation, document) => document.body.append(relation.content.cloneNode())],
    ['duplicate trigger ID', (relation, document) => document.body.append(relation.trigger.cloneNode())],
  ]
  it.each(invalidRelations)('rejects %s', (_, invalidate) => {
    const { result, relation, document } = closedDialogReview()
    invalidate(relation, document)
    expect(() => assertAxeResults(scan(result), { closedDialog: relation })).toThrow('incomplete')
  })

  it.each(['before', 'after'])('rejects another ARIA review attribute %s controls', (order) => {
    const { result, relation } = closedDialogReview()
    const trigger = relation.trigger
    if (order === 'before')
      trigger.removeAttribute('aria-controls')
    trigger.setAttribute('aria-describedby', 'missing-description')
    if (order === 'before')
      trigger.setAttribute('aria-controls', relation.content.id)
    // axe 4.11.0 can retain only the final controlsWithinPopup review message;
    // the live attribute boundary must reject it even with that exact payload.
    expect(() => assertAxeResults(scan(result), { closedDialog: relation })).toThrow('incomplete')
  })

  it('rejects extra incomplete results, even duplicates', () => {
    const { result, relation } = closedDialogReview()
    expect(() => assertAxeResults({ violations: [], incomplete: [result, result] }, { closedDialog: relation })).toThrow('incomplete')
  })

  it('never turns a violation into a review', () => {
    const { result, relation } = closedDialogReview()
    expect(() => assertAxeResults({ violations: [result], incomplete: [] }, { closedDialog: relation })).toThrow('violations')
  })
})

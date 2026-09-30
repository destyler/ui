import type { Result } from 'axe-core'
import type { ScanResults } from './axe-policy'
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
    expect(assertAxeResults(scan(), true)).toHaveLength(1)
  })

  it('never suppresses a violation, including the modal rule', () => {
    expect(() => assertAxeResults({ violations: [modalReview()], incomplete: [] }, true)).toThrow('violations')
  })

  it.each(['all', 'any', 'none'] as const)('rejects extra %s checks', (group) => {
    const result = modalReview()
    result.nodes[0][group].push({ id: 'another-check' } as Result['nodes'][number]['all'][number])
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects even duplicate modal checks', () => {
    const result = modalReview()
    result.nodes[0].all.push(result.nodes[0].all[0])
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it.each(['all', 'any', 'none'] as const)('rejects errors in %s checks', (group) => {
    const result = modalReview()
    const check = { ...result.nodes[0].all[0], error: new Error('check failed') }
    result.nodes[0][group] = [check]
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects a rule error', () => {
    const result = Object.assign(modalReview(), { error: new Error('rule failed') })
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects a node error', () => {
    const result = modalReview()
    Object.assign(result.nodes[0], { error: new Error('node failed') })
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects a root scan error', () => {
    expect(() => assertAxeResults({ ...scan(), error: new Error('scan failed') }, true)).toThrow('scan error')
  })

  it('rejects any unexpected rule alongside a permitted one', () => {
    const unexpected = { ...modalReview(), id: 'aria-valid-attr' }
    expect(() => assertAxeResults({ violations: [], incomplete: [modalReview(), unexpected] }, true)).toThrow('incomplete')
  })

  it('rejects missing modal checks', () => {
    const result = modalReview()
    result.nodes[0].all = []
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects a different check for the same rule', () => {
    const result = modalReview()
    result.nodes[0].all[0].id = 'focusable-content'
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })

  it('rejects empty nodes', () => {
    expect(() => assertAxeResults(scan({ ...modalReview(), nodes: [] }), true)).toThrow('incomplete')
  })

  it('requires every node to match the exact review shape', () => {
    const result = modalReview()
    result.nodes.push({ ...result.nodes[0], any: [{ id: 'extra-check' }] } as Result['nodes'][number])
    expect(() => assertAxeResults(scan(result), true)).toThrow('incomplete')
  })
})

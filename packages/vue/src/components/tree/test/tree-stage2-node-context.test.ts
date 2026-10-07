import type { NodeState } from '@destyler/tree'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import Fixture from './tree-stage2-node-context-fixture.vue'

let host: HTMLDivElement
let dispose: (() => void | Promise<void>) | undefined

afterEach(async () => {
  await dispose?.()
  dispose = undefined
  host?.remove()
})

function setup(rootProvider: boolean, uncontrolled = false) {
  host = document.createElement('div')
  document.body.append(host)
  const app = createApp(Fixture, { rootProvider, uncontrolled })
  dispose = () => app.unmount()
  app.mount(host)
}

function state(name: string): NodeState {
  return JSON.parse(host.querySelector(`[data-node-state="${name}"]`)!.textContent!)
}

function click(selector: string) {
  host.querySelector<HTMLButtonElement>(selector)!.click()
}

const initialBranch = {
  value: 'branch',
  valuePath: ['branch'],
  disabled: false,
  selected: false,
  focused: false,
  depth: 1,
  expanded: false,
  isBranch: true,
}
const initialLeaf = {
  value: 'leaf',
  valuePath: ['branch', 'leaf'],
  disabled: false,
  selected: true,
  focused: true,
  depth: 2,
  expanded: false,
  isBranch: false,
}
const disabledBranch = {
  value: 'other',
  valuePath: ['other'],
  disabled: true,
  selected: false,
  focused: false,
  depth: 1,
  expanded: false,
  isBranch: true,
}

describe.each([false, true])('tree.NodeContext (RootProvider=%s)', (rootProvider) => {
  it('provides custom branch, leaf, and disabled state from the nearest node', async () => {
    setup(rootProvider)
    await expect.poll(() => state('inner')).toEqual(initialLeaf)
    expect(state('outer-before')).toEqual(initialBranch)
    expect(state('outer-after')).toEqual(initialBranch)
    expect(state('sibling')).toEqual(disabledBranch)
    expect(host.querySelector('[data-part="branch-control"]')?.getAttribute('data-value')).toBe('branch')
  })

  it('reacts to selection, expansion, and focus changes without leaking nested state', async () => {
    setup(rootProvider)
    await expect.poll(() => state('inner')).toEqual(initialLeaf)
    for (let repeat = 0; repeat < 2; repeat++) {
      click('[data-update]')
      await expect.poll(() => state('outer-before')).toEqual({
        ...initialBranch,
        selected: true,
        expanded: true,
        focused: true,
      })
      expect(state('outer-after')).toEqual(state('outer-before'))
      expect(state('inner')).toEqual({ ...initialLeaf, selected: false, focused: false })
      expect(state('sibling')).toEqual(disabledBranch)
      expect(host.querySelector('[data-part="branch-control"]')?.getAttribute('data-state')).toBe('open')

      click('[data-update]')
      await expect.poll(() => state('inner')).toEqual(initialLeaf)
      expect(state('outer-before')).toEqual(initialBranch)
      expect(state('outer-after')).toEqual(initialBranch)
    }
  })

  it('reacts to public Tree.Context API updates on an uncontrolled tree', async () => {
    setup(rootProvider, true)
    await expect.poll(() => state('inner')).toEqual(initialLeaf)
    for (let repeat = 0; repeat < 2; repeat++) {
      click('[data-api-update]')
      await expect.poll(() => state('outer-before')).toEqual({
        ...initialBranch,
        selected: true,
        expanded: true,
      })
      expect(state('inner')).toEqual({ ...initialLeaf, selected: false })
      expect(state('outer-after')).toEqual(state('outer-before'))
      click('[data-api-update]')
      await expect.poll(() => state('inner')).toEqual(initialLeaf)
      expect(state('outer-before')).toEqual(initialBranch)
    }
  })

  it('recomputes changed node and indexPath props while preserving sibling and parent contexts', async () => {
    setup(rootProvider)
    await expect.poll(() => state('inner')).toEqual(initialLeaf)
    for (let repeat = 0; repeat < 2; repeat++) {
      click('[data-swap]')
      await expect.poll(() => state('inner')).toEqual(disabledBranch)
      expect(state('outer-before')).toEqual(initialBranch)
      expect(state('outer-after')).toEqual(initialBranch)
      expect(state('sibling')).toEqual(disabledBranch)
      click('[data-swap]')
      await expect.poll(() => state('inner')).toEqual(initialLeaf)
    }
  })
})

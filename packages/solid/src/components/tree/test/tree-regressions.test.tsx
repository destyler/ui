import type { Node } from './TreeFixture'
import { cleanup, render } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createTreeCollection } from '../index'
import { TreeFixture } from './TreeFixture'

afterEach(cleanup)

function collection(children: Node[]) {
  return createTreeCollection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.id,
    rootNode: { id: 'root', children },
  })
}

function control(value: string) {
  return document.querySelector<HTMLElement>(`[data-part="branch-control"][data-value="${value}"], [data-part="item"][data-value="${value}"]`)!
}

function state(part: 'expanded' | 'selected'): string[] {
  return JSON.parse(document.querySelector(`[data-testid="${part}"]`)!.textContent!)
}

async function focus(value: string) {
  control(value).focus()
  await expect.element(control(value)).toHaveFocus()
  await expect.element(control(value)).toHaveAttribute('data-focus')
}

const siblingCollection = collection([
  {
    id: 'ancestor',
    children: [
      { id: 'nested', children: [{ id: 'deep', children: [{ id: 'child' }] }] },
      { id: 'sibling', children: [{ id: 'sibling-child' }] },
      { id: 'leaf' },
    ],
  },
  { id: 'other', children: [{ id: 'other-child' }] },
  { id: 'closed', children: [{ id: 'closed-child' }] },
])
const initialExpanded = ['ancestor', 'other', 'deep']
const siblingExpanded = [...initialExpanded, 'nested', 'sibling']

const lastCollection = collection([
  { id: 'start' },
  {
    id: 'branch',
    children: [
      { id: 'child' },
      {
        id: 'nested',
        children: [
          { id: 'deep' },
          { id: 'disabled-deep', disabled: true },
          { id: 'disabled-tail', disabled: true, children: [{ id: 'disabled-descendant', disabled: true }] },
        ],
      },
    ],
  },
  { id: 'disabled-root', disabled: true },
])

describe.each([false, true])('tree keyboard controls (asChild=%s)', (asChildControls) => {
  it.each([
    { value: 'branch', expanded: ['parent'] },
    { value: 'branch', expanded: ['parent', 'branch'] },
    { value: 'leaf', expanded: ['parent'] },
  ])('keeps disabled $value inert with controlled expansion $expanded', async ({ value, expanded }) => {
    const onExpandedChange = vi.fn()
    const onSelectionChange = vi.fn()
    const onFocusChange = vi.fn()
    render(() => (
      <TreeFixture
        collection={collection([{ id: 'parent', children: [
          { id: 'branch', disabled: value === 'branch', children: [{ id: 'child' }] },
          { id: 'leaf', disabled: value === 'leaf' },
        ] }])}
        asChildControls={asChildControls}
        selectionMode="multiple"
        expandedValue={expanded}
        selectedValue={['parent']}
        onExpandedChange={onExpandedChange}
        onSelectionChange={onSelectionChange}
        onFocusChange={onFocusChange}
      />
    ))
    await focus(value)
    expect(control(value).tagName).toBe(asChildControls ? 'SPAN' : 'DIV')
    expect(control(value)).toHaveAttribute('data-disabled', '')
    onFocusChange.mockClear()

    // Up/Down/Home/End remain valid navigation on disabled controls. These
    // guarded keys must not select, expand, or move focus to a parent/child.
    for (const key of ['{ArrowLeft}', '{ArrowRight}', '{Enter}', ' ', '*', '{Meta>}a{/Meta}']) {
      await userEvent.keyboard(key)
      await expect.element(control(value)).toHaveFocus()
      expect(state('expanded')).toEqual(expanded)
      expect(state('selected')).toEqual(['parent'])
      expect(onExpandedChange).not.toHaveBeenCalled()
      expect(onSelectionChange).not.toHaveBeenCalled()
      expect(onFocusChange).not.toHaveBeenCalled()
    }
  })

  it.each([
    { key: '{ArrowUp}', target: 'first' },
    { key: '{Home}', target: 'first' },
    { key: '{ArrowDown}', target: 'last' },
    { key: '{End}', target: 'last' },
  ])('allows $key to leave a disabled control', async ({ key, target }) => {
    const onSelectionChange = vi.fn()
    render(() => (
      <TreeFixture
        collection={collection([{ id: 'first' }, { id: 'disabled', disabled: true }, { id: 'last' }])}
        asChildControls={asChildControls}
        onSelectionChange={onSelectionChange}
      />
    ))
    await focus('disabled')
    await userEvent.keyboard(key)
    await expect.element(control(target)).toHaveFocus()
    expect(onSelectionChange).not.toHaveBeenCalled()
  })

  it('retains enabled branch expansion, parent/child focus, and leaf selection', async () => {
    render(() => (
      <TreeFixture
        collection={collection([{ id: 'parent', children: [
          { id: 'branch', children: [{ id: 'child' }] },
          { id: 'leaf' },
        ] }])}
        asChildControls={asChildControls}
        defaultExpandedValue={['parent']}
      />
    ))
    await focus('branch')
    expect(control('branch')).not.toHaveAttribute('data-disabled')
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(control('child')).toBeVisible()
    await userEvent.keyboard('{ArrowRight}')
    await expect.element(control('child')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(control('branch')).toHaveFocus()
    await userEvent.keyboard('{ArrowLeft}')
    await expect.element(control('child')).not.toBeVisible()
    await focus('leaf')
    await userEvent.keyboard('{Enter}')
    await expect.element(control('leaf')).toHaveAttribute('aria-selected', 'true')
    await focus('branch')
    await userEvent.keyboard(' ')
    await expect.element(control('child')).toBeVisible()
    await expect.poll(() => state('selected')).toEqual(['branch'])
  })

  it.each(['nested', 'leaf'])('expands sibling branches from %s and keeps existing expansion', async (value) => {
    const onExpandedChange = vi.fn()
    const onSelectionChange = vi.fn()
    render(() => (
      <TreeFixture
        collection={siblingCollection}
        asChildControls={asChildControls}
        defaultExpandedValue={initialExpanded}
        defaultSelectedValue={['other-child']}
        onExpandedChange={onExpandedChange}
        onSelectionChange={onSelectionChange}
      />
    ))
    await focus(value)
    // Bubble from the label so the composed control's closest-node lookup is exercised.
    const label = control(value).querySelector('span')!
    for (let repeat = 0; repeat < 2; repeat++) {
      label.dispatchEvent(new KeyboardEvent('keydown', { key: '*', bubbles: true, cancelable: true }))
      await expect.poll(() => state('expanded')).toEqual(siblingExpanded)
      await expect.element(control('child')).toBeVisible()
      await expect.element(control('sibling-child')).toBeVisible()
      await expect.element(control('other-child')).toBeVisible()
      await expect.element(control('closed-child')).not.toBeVisible()
      await expect.element(control(value)).toHaveFocus()
      expect(onExpandedChange).toHaveBeenCalledTimes(1)
      expect(onSelectionChange).not.toHaveBeenCalled()
      expect(state('selected')).toEqual(['other-child'])
    }
  })
})

it('waits for controlled sibling expansion to be accepted by the parent', async () => {
  const onExpandedChange = vi.fn()
  const props = { collection: siblingCollection, selectedValue: ['other-child'], onExpandedChange }
  const [expanded, setExpanded] = createSignal(initialExpanded)
  render(() => <TreeFixture {...props} expandedValue={expanded()} />)
  await focus('nested')
  await userEvent.keyboard('*')
  expect(onExpandedChange).toHaveBeenLastCalledWith({ expandedValue: siblingExpanded, focusedValue: 'nested' })
  expect(state('expanded')).toEqual(initialExpanded)
  await expect.element(control('child')).not.toBeVisible()

  setExpanded(siblingExpanded)
  await expect.element(control('child')).toBeVisible()
  await expect.element(control('nested')).toHaveFocus()
  await userEvent.keyboard('*')
  expect(onExpandedChange).toHaveBeenCalledTimes(1)
  expect(state('selected')).toEqual(['other-child'])
})

describe.each([
  { name: 'collapsed root', expanded: [], last: 'branch' },
  { name: 'collapsed nested', expanded: ['branch'], last: 'nested' },
  { name: 'expanded nested with disabled trailing descendants', expanded: ['branch', 'nested', 'disabled-tail'], last: 'deep' },
  { name: 'expanded descendant below a collapsed ancestor', expanded: ['nested', 'disabled-tail'], last: 'branch' },
])('tree last visible node: $name', ({ expanded, last }) => {
  it.each(['{End}', '{Meta>}a{/Meta}', '{Shift>}{End}{/Shift}', '{ArrowUp}'])('%s focuses the last enabled visible node repeatedly', async (key) => {
    const onExpandedChange = vi.fn()
    const onSelectionChange = vi.fn()
    render(() => (
      <TreeFixture
        collection={lastCollection}
        selectionMode="multiple"
        defaultExpandedValue={expanded}
        defaultSelectedValue={['start']}
        onExpandedChange={onExpandedChange}
        onSelectionChange={onSelectionChange}
      />
    ))
    for (let repeat = 0; repeat < 2; repeat++) {
      await focus('start')
      await userEvent.keyboard(key)
      await expect.element(control(last)).toHaveFocus()
      await expect.element(control(last)).toBeVisible()
      expect(control(last)).not.toHaveAttribute('data-disabled')
      expect(state('expanded')).toEqual(expanded)
      expect(onExpandedChange).not.toHaveBeenCalled()
    }
    if (key.includes('Meta') || key.includes('Shift')) {
      expect(onSelectionChange).toHaveBeenCalled()
      expect(state('selected')).toEqual(expect.arrayContaining(['start', last]))
    }
    else {
      expect(state('selected')).toEqual(['start'])
      expect(onSelectionChange).not.toHaveBeenCalled()
    }
  })
})

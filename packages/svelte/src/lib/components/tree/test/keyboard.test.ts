import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { userEvent } from 'vitest/browser'
import KeyboardFixture from './KeyboardFixture.svelte'

function control(value: string) {
  return document.querySelector<HTMLElement>(`[data-part="branch-control"][data-value="${value}"], [data-part="item"][data-value="${value}"]`)!
}

function branch(value: string) {
  return document.querySelector<HTMLElement>(`[data-part="branch"][data-value="${value}"]`)!
}

function values(kind: 'expanded' | 'selected') {
  return JSON.parse(document.querySelector(`[data-${kind}]`)!.textContent!) as string[]
}

const guardedKeys = [
  { key: 'ArrowLeft', input: '{ArrowLeft}' },
  { key: 'ArrowRight', input: '{ArrowRight}' },
  { key: 'Enter', input: '{Enter}' },
  { key: ' ', input: ' ' },
  { key: '*', input: '*' },
  { key: 'a', input: '{Meta>}a{/Meta}', metaKey: true },
]

const focusScenarios = [
  { name: 'collapsed branch', expanded: [], expected: 'branch' },
  { name: 'collapsed nested branch', expanded: ['branch'], expected: 'nested' },
  { name: 'expanded nested branch with disabled trailing descendants', expanded: ['branch', 'nested', 'disabled-trailing'], expected: 'deep' },
  { name: 'expanded descendant beneath a collapsed ancestor', expanded: ['nested', 'disabled-trailing'], expected: 'branch' },
]

const lastNodeKeys = [
  { name: 'End', input: '{End}', selects: false },
  { name: 'Meta+A', input: '{Meta>}a{/Meta}', selects: true },
  { name: 'Shift+End', input: '{Shift>}{End}{/Shift}', selects: true },
  { name: 'ArrowUp wrap', input: '{ArrowUp}', selects: false },
]

// Exercise ordinary uncontrolled parts and controlled, composed parts. The
// fixtures write change requests back through the framework's parent state.
describe.each([
  { name: 'default/uncontrolled', asChild: false, controlled: false },
  { name: 'asChild/controlled', asChild: true, controlled: true },
])('[tree] keyboard regressions ($name)', ({ asChild, controlled }) => {
  it.each([
    { part: 'branch', expanded: false },
    { part: 'branch', expanded: true },
    { part: 'leaf', expanded: false },
  ])('keeps disabled $part inert (expanded=$expanded)', async ({ part, expanded }) => {
    const onExpandedChange = vi.fn()
    const onSelectionChange = vi.fn()
    const onFocusChange = vi.fn()
    const initialExpanded = expanded ? ['parent', 'branch'] : ['parent']
    await render(KeyboardFixture, { props: {
      asChild,
      controlled,
      initialExpanded,
      initialSelected: ['parent'],
      onExpandedChange,
      onSelectionChange,
      onFocusChange,
      nodes: [{ id: 'parent', children: [
        { id: 'branch', disabled: part === 'branch', children: [{ id: 'child' }] },
        { id: 'leaf', disabled: part === 'leaf' },
      ] }],
    } })
    const target = control(part)
    expect(target).toHaveAttribute('data-disabled', '')
    expect(target.hasAttribute('data-composed')).toBe(asChild)
    target.focus()
    await vi.waitFor(() => expect(target).toHaveAttribute('data-focus'))
    onFocusChange.mockClear()

    // Up/Down/Home/End intentionally remain navigable from disabled controls.
    // Guarded keys must be inert both on the control and a nested text target.
    for (const { key, input, metaKey } of guardedKeys) {
      await userEvent.keyboard(input)
      const event = new KeyboardEvent('keydown', { key, metaKey, bubbles: true, cancelable: true })
      target.querySelector('[data-part$="-text"]')!.dispatchEvent(event)
      expect(event.defaultPrevented, key).toBe(false)
      expect(target, key).toHaveFocus()
      expect(values('expanded'), key).toEqual(initialExpanded)
      expect(values('selected'), key).toEqual(['parent'])
      expect(branch('branch'), key).toHaveAttribute('aria-expanded', String(expanded))
      expect(onExpandedChange, key).not.toHaveBeenCalled()
      expect(onSelectionChange, key).not.toHaveBeenCalled()
      expect(onFocusChange, key).not.toHaveBeenCalled()
    }
  })

  it.each(['branch', 'leaf'])('keeps ordinary navigation available from a disabled %s', async (part) => {
    await render(KeyboardFixture, { props: {
      asChild,
      controlled,
      initialExpanded: ['parent'],
      initialSelected: ['start'],
      nodes: [
        { id: 'start' },
        { id: 'parent', children: [
          { id: 'branch', disabled: true, children: [{ id: 'child' }] },
          { id: 'leaf', disabled: true },
          { id: 'tail' },
        ] },
      ],
    } })
    for (const { input, expected } of [
      { input: '{ArrowDown}', expected: 'tail' },
      { input: '{ArrowUp}', expected: 'parent' },
      { input: '{Home}', expected: 'start' },
      { input: '{End}', expected: 'tail' },
    ]) {
      control(part).focus()
      await userEvent.keyboard(input)
      await vi.waitFor(() => expect(control(expected)).toHaveFocus())
      expect(values('expanded')).toEqual(['parent'])
      expect(values('selected')).toEqual(['start'])
    }
  })

  it('keeps the guarded keys working on enabled branches and leaves', async () => {
    await render(KeyboardFixture, { props: {
      asChild,
      controlled,
      initialExpanded: ['parent'],
      nodes: [{ id: 'parent', children: [
        { id: 'branch', children: [{ id: 'child' }] },
        { id: 'leaf' },
      ] }],
    } })
    control('branch').focus()
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(branch('branch')).toHaveAttribute('aria-expanded', 'true'))
    await userEvent.keyboard('{ArrowRight}')
    await vi.waitFor(() => expect(control('child')).toHaveFocus())
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(control('branch')).toHaveFocus())
    await userEvent.keyboard('{ArrowLeft}')
    await vi.waitFor(() => expect(branch('branch')).toHaveAttribute('aria-expanded', 'false'))
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(branch('branch')).toHaveAttribute('aria-expanded', 'true'))
    expect(values('selected')).toEqual(['branch'])
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(branch('branch')).toHaveAttribute('aria-expanded', 'false'))
    control('leaf').focus()
    await userEvent.keyboard('{Enter}')
    await vi.waitFor(() => expect(values('selected')).toEqual(['leaf']))
    await userEvent.keyboard('{Meta>}a{/Meta}')
    await vi.waitFor(() => expect(values('selected')).toEqual(['parent', 'branch', 'child', 'leaf']))
    expect(control('leaf')).toHaveFocus()
    await userEvent.keyboard(' ')
    await vi.waitFor(() => expect(values('selected')).toEqual(['leaf']))
    await userEvent.keyboard('*')
    await vi.waitFor(() => expect(values('expanded')).toEqual(['parent', 'branch']))
    expect(control('leaf')).toHaveFocus()
  })

  it.each(['nested', 'leaf'])('adds only sibling branches from %s without dropping existing expansion', async (focused) => {
    const onExpandedChange = vi.fn()
    const onSelectionChange = vi.fn()
    const initialExpanded = ['ancestor', 'other', 'deep']
    const expectedExpanded = [...initialExpanded, 'nested', 'sibling']
    await render(KeyboardFixture, { props: {
      asChild,
      controlled,
      initialExpanded,
      initialSelected: ['other-child'],
      onExpandedChange,
      onSelectionChange,
      nodes: [
        { id: 'ancestor', children: [
          { id: 'nested', children: [{ id: 'deep', children: [{ id: 'deep-child' }] }] },
          { id: 'sibling', children: [{ id: 'sibling-child' }] },
          { id: 'leaf' },
        ] },
        { id: 'other', children: [{ id: 'other-child' }] },
        { id: 'closed', children: [{ id: 'closed-child' }] },
        { id: 'root-leaf' },
      ],
    } })
    control(focused).focus()
    for (let cycle = 0; cycle < 2; cycle++) {
      await userEvent.keyboard('*')
      await vi.waitFor(() => expect(values('expanded')).toEqual(expectedExpanded))
      for (const value of expectedExpanded)
        expect(branch(value)).toHaveAttribute('aria-expanded', 'true')
      expect(branch('closed')).toHaveAttribute('aria-expanded', 'false')
      expect(control('closed-child')).not.toBeVisible()
      expect(control('deep-child')).toBeVisible()
      expect(control('sibling-child')).toBeVisible()
      expect(control('other-child')).toBeVisible()
      expect(control(focused)).toHaveFocus()
      expect(control(focused)).toBeVisible()
      expect(values('selected')).toEqual(['other-child'])
      expect(onSelectionChange).not.toHaveBeenCalled()
      expect(onExpandedChange).toHaveBeenCalledExactlyOnceWith({ expandedValue: expectedExpanded, focusedValue: focused })
    }
    expect(initialExpanded).toEqual(['ancestor', 'other', 'deep'])
  })

  describe.each(focusScenarios)('$name', ({ expanded, expected }) => {
    it.each(lastNodeKeys)('$name focuses the last visible enabled node repeatedly', async ({ input, selects }) => {
      const onExpandedChange = vi.fn()
      const onSelectionChange = vi.fn()
      await render(KeyboardFixture, { props: {
        asChild,
        controlled,
        initialExpanded: expanded,
        initialSelected: ['start'],
        onExpandedChange,
        onSelectionChange,
        nodes: [
          { id: 'start' },
          { id: 'branch', children: [
            { id: 'child' },
            { id: 'nested', children: [
              { id: 'deep' },
              { id: 'disabled-deep', disabled: true },
              { id: 'disabled-trailing', disabled: true, children: [{ id: 'disabled-deepest', disabled: true }] },
            ] },
          ] },
          { id: 'disabled-root', disabled: true },
        ],
      } })
      for (let cycle = 0; cycle < 2; cycle++) {
        control('start').focus()
        await userEvent.keyboard(input)
        await vi.waitFor(() => expect(control(expected)).toHaveFocus())
        expect(control(expected)).toBeVisible()
        expect(control(expected)).not.toHaveAttribute('data-disabled')
        expect(values('expanded')).toEqual(expanded)
        expect(onExpandedChange).not.toHaveBeenCalled()
        if (selects) {
          expect(onSelectionChange).toHaveBeenCalledWith(expect.objectContaining({
            selectedValue: expect.arrayContaining(['start', expected]),
          }))
          expect(values('selected')).toEqual(expect.arrayContaining(['start', expected]))
        }
        else {
          expect(values('selected')).toEqual(['start'])
          expect(onSelectionChange).not.toHaveBeenCalled()
        }
      }
    })
  })
})

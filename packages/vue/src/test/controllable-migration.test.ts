import type { App, Component, VNodeChild } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createApp, defineComponent, h, nextTick, reactive } from 'vue'
import { assertFocusRestored, assertOwnershipCoverage, assertOwnershipSnapshot, assertTextSelection, ownershipScenarios } from '../../../../utils/test/behavior-contracts'
import { trackDocumentListeners } from '../../../../utils/test/document-listeners'
import { Calendar, parseDate, useCalendar } from '../components/calendar'
import { Checkbox, useCheckbox } from '../components/checkbox'
import CheckboxIndeterminate from '../components/checkbox/examples/Indeterminate.vue'
import { Collapsible, useCollapsible } from '../components/collapsible'
import { ColorPicker, useColorPicker } from '../components/color-picker'
import { Combobox, createListCollection, useCombobox } from '../components/combobox'
import { Dialog, useDialog } from '../components/dialog'
import { Dynamic, useDynamic } from '../components/dynamic'
import { Edit, useEdit } from '../components/edit'
import { FloatingPanel, useFloatingPanel } from '../components/floating-panel'
import { HoverCard, useHoverCard } from '../components/hover-card'
import { Menu, useMenu } from '../components/menu'
import { NumberInput, useNumberInput } from '../components/number-input'
import FractionDigits from '../components/number-input/examples/FractionDigits.vue'
import { Pagination, usePagination } from '../components/pagination'
import { Popover, usePopover } from '../components/popover'
import { QrCode, useQrCode } from '../components/qr-code'
import { Select, useSelect } from '../components/select'
import SplitterRootProvider from '../components/splitter/examples/RootProvider.vue'
import { Tooltip, useTooltip } from '../components/tooltip'
import { Tree, useTree } from '../components/tree'
import TreeInitialValue from '../components/tree/examples/InitialValue.vue'
import { createFileTreeCollection } from '../utils/collection'

type Entry = 'Root' | 'hook' | 'RootProvider'
const entries: Entry[] = ['Root', 'hook', 'RootProvider']
const apps: App[] = []
const collection = createListCollection({ items: ['one', 'two'] })
const openComponents = [
  ['calendar', Calendar, useCalendar, {}],
  ['collapsible', Collapsible, useCollapsible, {}],
  ['color-picker', ColorPicker, useColorPicker, {}],
  ['combobox', Combobox, useCombobox, { collection }],
  ['dialog', Dialog, useDialog, { modal: false }],
  ['floating-panel', FloatingPanel, useFloatingPanel, {}],
  ['hover-card', HoverCard, useHoverCard, {}],
  ['menu', Menu, useMenu, {}],
  ['popover', Popover, usePopover, {}],
  ['select', Select, useSelect, { collection }],
  ['tooltip', Tooltip, useTooltip, {}],
] as const

afterEach(async () => {
  for (const app of apps.splice(0)) app.unmount()
  await nextTick()
  document.body.replaceChildren()
})

async function flush() {
  for (let i = 0; i < 5; i++) {
    await nextTick()
    await Promise.resolve()
  }
}

async function mount(component: Component) {
  const container = document.createElement('div')
  document.body.append(container)
  const app = createApp(component)
  apps.push(app)
  app.mount(container)
  await flush()
  return container
}

// Render every machine node used by overlay activities, including their content.
// The Context path exercises Root's real prop declaration and event boundary.
function openParts(api: any) {
  const content = h('div', api.getContentProps(), [h('button', 'Content action')])
  return [
    h('button', { ...api.getTriggerProps(), 'data-testid': 'trigger' }, 'Toggle'),
    api.getInputProps ? h('input', api.getInputProps({})) : null,
    api.getPositionerProps ? h('div', api.getPositionerProps(), [content]) : content,
    h('output', { 'data-testid': 'open' }, String(api.open)),
  ]
}

async function fixture(namespace: any, hook: any, entry: Entry, initial: any, renderParts: (api: any) => VNodeChild = openParts) {
  const props = reactive({ ...initial })
  let api: any
  const renderApi = (value: any) => {
    api = value
    return renderParts(value)
  }
  const component = defineComponent({
    setup() {
      if (entry === 'Root')
        return () => h(namespace.Root, props, { default: () => h(namespace.Context, {}, { default: renderApi }) })
      const result = hook(props)
      const value = result.api ?? result
      if (entry === 'hook')
        return () => h('div', [renderApi(value.value)])
      return () => h(namespace.RootProvider, { value: result.api ? result : value.value }, {
        default: () => h(namespace.Context, {}, { default: renderApi }),
      })
    },
  })
  const container = await mount(component)
  const app = apps.at(-1)!
  return {
    unmount() {
      app.unmount()
      apps.splice(apps.indexOf(app), 1)
    },
    props,
    container,
    get api() { return api },
  }
}

function assertOpen(instance: Awaited<ReturnType<typeof fixture>>, open: boolean) {
  expect(instance.api.open).toBe(open)
  expect(instance.container.querySelector('[data-testid="open"]')?.textContent).toBe(String(open))
  expect(instance.container.querySelector('[data-testid="trigger"]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
}

describe('controllable migration: live open precedence', () => {
  for (const [name, namespace, hook, required] of openComponents) {
    for (const entry of entries) {
      it.each([false, true])(`${name} ${entry}: live open=%s wins over the opposite default`, async (open) => {
        const instance = await fixture(namespace, hook, entry, { ...required, open, defaultOpen: !open })
        assertOpen(instance, open)
        instance.props.defaultOpen = open
        await flush()
        assertOpen(instance, open)
        instance.props.open = !open
        await flush()
        assertOpen(instance, !open)
      })
    }
  }

  for (const entry of entries) {
    it(`Collapsible ${entry}: undefined open remains uncontrolled after two requests`, async () => {
      const onOpenChange = vi.fn()
      const instance = await fixture(Collapsible, useCollapsible, entry, { open: undefined, defaultOpen: true, onOpenChange })
      assertOpen(instance, true)
      instance.api.setOpen(false)
      await flush()
      assertOpen(instance, false)
      instance.api.setOpen(true)
      await flush()
      assertOpen(instance, true)
      expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([false, true])
    })
  }
})

function calendarParts(api: any) {
  return h('div', { 'data-view': api.view }, [
    h('input', api.getInputProps({})),
    h('output', api.view),
  ])
}

function editParts(api: any) {
  return h('div', api.getRootProps(), [
    h('input', api.getInputProps()),
    h('span', api.getPreviewProps()),
    h('button', api.getEditTriggerProps(), 'Edit'),
    h('button', api.getSubmitTriggerProps(), 'Save'),
    h('button', api.getCancelTriggerProps(), 'Cancel'),
    h('output', String(api.editing)),
  ])
}

describe('initial UI states', () => {
  for (const entry of entries) {
    it(`Calendar ${entry}: defaultView seeds once and never resets user view`, async () => {
      const instance = await fixture(Calendar, useCalendar, entry, { defaultView: 'year', disabled: false }, calendarParts)
      expect(instance.api.view).toBe('year')
      expect(instance.container.querySelector('[data-view]')?.getAttribute('data-view')).toBe('year')
      instance.api.setView('month')
      await flush()
      expect(instance.api.view).toBe('month')
      Object.assign(instance.props, { defaultView: 'day', disabled: true })
      await flush()
      expect(instance.api.view).toBe('month')
      expect(instance.container.querySelector('output')?.textContent).toBe('month')
    })

    it(`Calendar ${entry}: live view has precedence and follows parent updates`, async () => {
      const instance = await fixture(Calendar, useCalendar, entry, { view: 'month', defaultView: 'year' }, calendarParts)
      expect(instance.api.view).toBe('month')
      instance.props.view = 'day'
      await flush()
      expect(instance.api.view).toBe('day')
    })

    it.each(['submit', 'cancel'])(`Edit ${entry}: defaultEdit can %s and does not reset`, async (action) => {
      const onEditChange = vi.fn()
      const onValueCommit = vi.fn()
      const onValueRevert = vi.fn()
      const instance = await fixture(Edit, useEdit, entry, {
        defaultEdit: true,
        defaultValue: 'seed',
        onEditChange,
        onValueCommit,
        onValueRevert,
        activationMode: 'click',
      }, editParts)
      expect(instance.api.editing).toBe(true)
      expect(instance.container.querySelector('input')?.hidden).toBe(false)
      instance.api.setValue('edited')
      await flush()
      instance.api[action]()
      await flush()
      expect(instance.api.value).toBe(action === 'submit' ? 'edited' : 'seed')
      expect(action === 'submit' ? onValueCommit : onValueRevert).toHaveBeenCalledExactlyOnceWith({ value: action === 'submit' ? 'edited' : 'seed' })
      expect(action === 'submit' ? onValueRevert : onValueCommit).not.toHaveBeenCalled()
      expect(instance.api.editing).toBe(false)
      expect(instance.container.querySelector('input')?.hidden).toBe(true)
      expect(onEditChange).toHaveBeenCalledWith({ edit: false })
      Object.assign(instance.props, { defaultEdit: false, placeholder: 'changed' })
      await flush()
      instance.props.defaultEdit = true
      await flush()
      expect(instance.api.editing).toBe(false)
      instance.api.edit()
      await flush()
      expect(instance.api.editing).toBe(true)
      expect(onEditChange).toHaveBeenLastCalledWith({ edit: true })
    })

    it(`Edit ${entry}: explicit false wins and vetoes requests until parent writes back`, async () => {
      const onEditChange = vi.fn()
      const instance = await fixture(Edit, useEdit, entry, { edit: false, defaultEdit: true, onEditChange, activationMode: 'click' }, editParts)
      expect(instance.api.editing).toBe(false)
      instance.api.edit()
      await flush()
      expect(onEditChange).toHaveBeenCalledWith({ edit: true })
      expect(instance.api.editing).toBe(false)
      instance.props.edit = true
      await flush()
      expect(instance.api.editing).toBe(true)
      instance.api.cancel()
      await flush()
      expect(onEditChange).toHaveBeenLastCalledWith({ edit: false })
      expect(instance.api.editing).toBe(true)
      instance.props.edit = false
      await flush()
      expect(instance.api.editing).toBe(false)
    })
  }
})

function paginationParts(api: any) {
  return [h('output', `${api.pageSize}/${api.totalPages}`), h('button', api.getNextTriggerProps(), 'Next')]
}

describe('root prop and event contracts', () => {
  it('combobox Root consumes defaultInputValue instead of leaking it to the DOM', async () => {
    const instance = await fixture(Combobox, useCombobox, 'Root', { collection, defaultInputValue: 'needle' })
    expect(instance.api.inputValue).toBe('needle')
    expect(instance.container.querySelector('input')?.value).toBe('needle')
    expect(instance.container.querySelector('[defaultinputvalue]')).toBeNull()
    instance.api.setInputValue('changed')
    await flush()
    instance.props.defaultInputValue = 'ignored'
    await flush()
    expect(instance.api.inputValue).toBe('changed')
    expect(instance.container.querySelector('input')?.value).toBe('changed')
  })

  it('pagination Root consumes defaultPageSize instead of leaking it to the DOM', async () => {
    const instance = await fixture(Pagination, usePagination, 'Root', { count: 100, defaultPageSize: 25 }, paginationParts)
    expect(instance.api.pageSize).toBe(25)
    expect(instance.container.querySelector('output')?.textContent).toBe('25/4')
    expect(instance.container.querySelector('[defaultpagesize]')).toBeNull()
    instance.api.setPageSize(20)
    await flush()
    instance.props.defaultPageSize = 50
    await flush()
    expect(instance.api.pageSize).toBe(20)
  })

  it.each([false, true])('pagination Root emits controlled pageSize requests; parent writeback=%s', async (writeback) => {
    const onPageSizeChange = vi.fn()
    const instance = await fixture(Pagination, usePagination, 'Root', { count: 100, pageSize: 10, onPageSizeChange }, paginationParts)
    if (writeback)
      onPageSizeChange.mockImplementation(details => instance.props.pageSize = details.pageSize)
    instance.api.setPageSize(25)
    await flush()
    expect(onPageSizeChange).toHaveBeenCalledExactlyOnceWith({ pageSize: 25 })
    expect(instance.api.pageSize).toBe(writeback ? 25 : 10)
    expect(instance.container.querySelector('output')?.textContent).toBe(writeback ? '25/4' : '10/10')
  })
})

describe('published examples remain interactive', () => {
  it('indeterminate checkbox transitions through checked and unchecked', async () => {
    const container = await mount(CheckboxIndeterminate)
    const input = container.querySelector('input')!
    const control = container.querySelector('[data-part="control"]')!
    expect(input.checked).toBe(false)
    expect(control.getAttribute('data-state')).toBe('indeterminate')
    input.click()
    await flush()
    expect(input.indeterminate).toBe(false)
    expect(input.checked).toBe(true)
    expect(control.getAttribute('data-state')).toBe('checked')
    input.click()
    await flush()
    expect(input.checked).toBe(false)
    expect(control.getAttribute('data-state')).toBe('unchecked')
  })

  it('fractionDigits increments its default value', async () => {
    const container = await mount(FractionDigits)
    const input = container.querySelector('input')!
    expect(input.value).toBe('1.00')
    const increment = container.querySelector<HTMLButtonElement>('[data-part="increment-trigger"]')!
    increment.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, button: 0, pointerType: 'mouse' }))
    increment.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }))
    await flush()
    expect(input.value).toBe('2.00')
  })

  it('splitter RootProvider maximizes a panel from default sizes', async () => {
    const container = await mount(SplitterRootProvider)
    const panel = container.querySelector<HTMLElement>('[data-part="panel"]')!
    expect(panel.style.flexGrow).toBe('50')
    container.querySelector('button')!.click()
    await flush()
    expect(panel.style.flexGrow).toBe('100')
    const other = container.querySelectorAll<HTMLElement>('[data-part="panel"]')[1]
    expect(other.style.flexGrow).toBe('0')
    container.querySelector('button')!.click()
    await flush()
    expect(panel.style.flexGrow).toBe('100')
    expect(other.style.flexGrow).toBe('0')
  })

  it('tree InitialValue actually seeds selected and expanded branches', async () => {
    const container = await mount(TreeInitialValue)
    const src = container.querySelector('[data-part="branch"][data-value="src"]')!
    const modules = container.querySelector('[data-part="branch"][data-value="node_modules"]')!
    expect(src.getAttribute('aria-selected')).toBe('true')
    expect(src.getAttribute('aria-expanded')).toBe('true')
    expect(modules.getAttribute('aria-selected')).toBe('false')
    expect(modules.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('[data-part="item"][data-value="src/app.tsx"]')).not.toBeNull()
  })
})

describe('existing initial-only value adapters', () => {
  const components = [
    ['Dynamic', Dynamic, useDynamic, ['seed'], [], ['edited']],
    ['QrCode', QrCode, useQrCode, 'seed', '', 'edited'],
  ] as const
  const parts = (api: any) => [
    api.getInputProps ? h('input', api.getInputProps()) : null,
    api.getHiddenInputProps ? h('input', api.getHiddenInputProps()) : null,
    h('output', JSON.stringify(api.value)),
  ]
  for (const [name, namespace, hook, seed, empty, edited] of components) {
    for (const entry of entries) {
      it(`${name} ${entry}: unrelated/default updates retain internal changes`, async () => {
        const instance = await fixture(namespace, hook, entry, { defaultValue: seed }, parts)
        expect(instance.api.value).toEqual(seed)
        instance.api.setValue(edited)
        await flush()
        Object.assign(instance.props, { defaultValue: empty, ids: { root: 'unrelated-root' } })
        await flush()
        expect(instance.api.value).toEqual(edited)
        expect(instance.container.querySelector('output')?.textContent).toBe(JSON.stringify(edited))
      })
      it(`${name} ${entry}: explicit empty value wins and live updates still synchronize`, async () => {
        const instance = await fixture(namespace, hook, entry, { defaultValue: seed, modelValue: empty }, parts)
        expect(instance.api.value).toEqual(empty)
        instance.props.modelValue = edited
        await flush()
        expect(instance.api.value).toEqual(edited)
        instance.props.modelValue = empty
        await flush()
        expect(instance.api.value).toEqual(empty)
        expect(instance.container.querySelector('output')?.textContent).toBe(JSON.stringify(empty))
      })
    }
  }
})

const sharedOwnershipCases = [
  { name: 'Checkbox.checked', namespace: Checkbox, hook: useCheckbox, field: 'checked', prop: 'checked', initial: false, next: true },
  { name: 'NumberInput.value', namespace: NumberInput, hook: useNumberInput, field: 'value', prop: 'modelValue', initial: '1', next: '2' },
  { name: 'Combobox.value', namespace: Combobox, hook: useCombobox, field: 'value', prop: 'modelValue', initial: ['one'], next: ['two'], props: { collection } },
  { name: 'Combobox.inputValue', namespace: Combobox, hook: useCombobox, field: 'inputValue', prop: 'inputValue', initial: 'one', next: 'two', props: { collection } },
  { name: 'Dialog.open', namespace: Dialog, hook: useDialog, field: 'open', prop: 'open', initial: false, next: true, props: { modal: false, closeOnInteractOutside: false } },
  { name: 'Calendar.value', namespace: Calendar, hook: useCalendar, field: 'value', prop: 'modelValue', initial: [parseDate('2026-01-01')], next: [parseDate('2026-02-02')] },
  { name: 'Tree.selectedValue', namespace: Tree, hook: useTree, field: 'selectedValue', prop: 'selectedValue', initial: ['src'], next: ['lib'], props: { collection: createFileTreeCollection(['src/app.ts', 'lib/index.ts']) } },
  { name: 'Tree.expandedValue', namespace: Tree, hook: useTree, field: 'expandedValue', prop: 'expandedValue', initial: ['src'], next: ['lib'], props: { collection: createFileTreeCollection(['src/app.ts', 'lib/index.ts']) } },
]
it('shared contract coverage includes every target field', () => assertOwnershipCoverage(sharedOwnershipCases.map(row => row.name)))
for (const row of sharedOwnershipCases) {
  for (const entry of entries) {
    for (const scenario of ownershipScenarios) {
      it(`shared contract: ${row.name} ${entry}: ${scenario.name}`, async () => {
        const suffix = row.field[0].toUpperCase() + row.field.slice(1)
        const callback = row.field === 'selectedValue' ? 'onSelectionChange' : row.field === 'expandedValue' ? 'onExpandedChange' : `on${suffix}Change`
        const onChange = vi.fn()
        const values = { initial: row.initial, next: row.next }
        const format = (value: any) => JSON.stringify(row.name === 'Calendar.value' ? value.map(String) : value)
        const instance = await fixture(row.namespace, row.hook, entry, {
          ...row.props,
          [row.prop]: scenario.controlled ? row.initial : undefined,
          [`default${suffix}`]: values[scenario.defaultValue],
          [callback]: onChange,
        }, api => h('output', { 'data-contract': '' }, format(api[row.field])))
        if (scenario.accept)
          onChange.mockImplementation(details => instance.props[row.prop] = details[row.field])
        const check = (value: unknown, requests: unknown[]) => vi.waitFor(() => assertOwnershipSnapshot({
          api: format(instance.api[row.field]),
          rendered: instance.container.querySelector('[data-contract]')?.textContent,
          requests: onChange.mock.calls.map(([details]) => format(details[row.field])),
        }, format(value), requests.map(format)))
        await check(row.initial, [])
        for (const step of scenario.steps) {
          if (step.action === 'request')
            instance.api[`set${suffix}`](values[step.value])
          if (step.action === 'parent')
            instance.props[row.prop] = values[step.value]
          if (step.action === 'default')
            instance.props[`default${suffix}`] = values[step.value]
          if (step.action === 'rerender')
            instance.props[row.field === 'open' ? 'closeOnEscape' : 'disabled'] = step.value === 'next'
          await flush()
          await check(values[step.expected], step.requests.map(value => values[value]))
        }
      })
    }
  }
}

it('shared dialog lifecycle: restores focus twice and disposes document keydown listeners on unmount', async () => {
  const onOpenChange = vi.fn()
  const instance = await fixture(Dialog, useDialog, 'Root', { 'defaultOpen': false, 'preventScroll': false, 'aria-label': 'Contract dialog', onOpenChange }, api => [
    h('button', { ...api.getTriggerProps(), 'data-contract-trigger': '' }, 'Open'),
    h('div', api.getPositionerProps(), [h('div', api.getContentProps(), [h('button', api.getCloseTriggerProps(), 'Close')])]),
  ])
  const trigger = instance.container.querySelector<HTMLButtonElement>('[data-contract-trigger]')!
  const listeners = trackDocumentListeners(trigger.ownerDocument, 'keydown')
  try {
    for (const close of ['api', 'escape']) {
      trigger.focus()
      trigger.click()
      await vi.waitFor(() => expect(instance.api.open).toBe(true))
      await vi.waitFor(() => expect(instance.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
      await vi.waitFor(() => listeners.expectActive())
      if (close === 'api')
        instance.api.setOpen(false)
      else
        document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await vi.waitFor(() => {
        expect(instance.api.open).toBe(false)
        assertFocusRestored(trigger)
        listeners.expectEmpty()
      })
    }
    trigger.click()
    await vi.waitFor(() => expect(instance.api.open).toBe(true))
    await vi.waitFor(() => expect(instance.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
    await vi.waitFor(() => listeners.expectActive())
    instance.unmount()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 35))
    expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([true, false, true, false, true])
    await vi.waitFor(() => listeners.expectEmpty())
  }
  finally {
    listeners.restore()
  }
})

it('shared text editing: NumberInput preserves accepted partial text and caret', async () => {
  const onValueChange = vi.fn()
  const instance = await fixture(NumberInput, useNumberInput, 'Root', { defaultValue: '10', onValueChange }, api => h('input', api.getInputProps()))
  const input = instance.container.querySelector('input')!
  input.focus()
  for (const value of ['1.', '1.2']) {
    input.value = value
    input.setSelectionRange(1, 1)
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType: 'insertText' }))
    await flush()
    await new Promise(resolve => setTimeout(resolve, 35))
    assertTextSelection(input, value, 1)
    expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value }))
  }
})

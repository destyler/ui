import type { ReactNode } from 'react'
import type { Root } from 'react-dom/client'
import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Calendar, parseDate, useCalendar } from '~/components/calendar'
import { useCarousel } from '~/components/carousel'
import { Checkbox, useCheckbox } from '~/components/checkbox'
import { Indeterminate } from '~/components/checkbox/examples/Indeterminate'
import { useCollapse } from '~/components/collapse'
import { Collapsible, useCollapsible } from '~/components/collapsible'
import { ColorPicker, parseColor, useColorPicker } from '~/components/color-picker'
import { Combobox, useCombobox } from '~/components/combobox'
import { Dialog, useDialog } from '~/components/dialog'
import { Edit, useEdit } from '~/components/edit'
import { FloatingPanel, useFloatingPanel } from '~/components/floating-panel'
import { HoverCard, useHoverCard } from '~/components/hover-card'
import { Menu, useMenu } from '~/components/menu'
import { useNavigationMenu } from '~/components/navigation-menu'
import { useNumberInput } from '~/components/number-input'
import { useOtpInput } from '~/components/otp-input'
import { usePagination } from '~/components/pagination'
import { Popover, usePopover } from '~/components/popover'
import { useRadio } from '~/components/radio'
import { Select, useSelect } from '~/components/select'
import { InitialValue as SelectInitialValue } from '~/components/select/examples/InitialValue'
import { useSlider } from '~/components/slider'
import { useSplitter } from '~/components/splitter'
import { RootProvider as SplitterRootProvider } from '~/components/splitter/examples/RootProvider'
import { useSteps } from '~/components/steps'
import { useSwitch } from '~/components/switch'
import { useTabs } from '~/components/tabs'
import { useToggleGroup } from '~/components/toggle-group'
import { Tooltip, useTooltip } from '~/components/tooltip'
import { useTree } from '~/components/tree'
import { InitialValue as TreeInitialValue } from '~/components/tree/examples/InitialValue'
import { createFileTreeCollection, createListCollection } from '~/utils/collection'
import { assertFocusRestored, assertOwnershipCoverage, assertOwnershipSnapshot, ownershipScenarios } from '../../../../../utils/test/behavior-contracts'
import { trackDocumentListeners } from '../../../../../utils/test/document-listeners'

// These tests run in the browser suite, and can also run in happy-dom with the
// production React Compiler enabled. The hook implementations are never mocked.
const roots: Root[] = []
beforeEach(() => vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true))
afterEach(async () => {
  for (const root of roots.splice(0)) {
    await act(async () => root.unmount())
  }
  document.body.replaceChildren()
  vi.unstubAllGlobals()
})

type Hook = (props: any) => any
const collection = createListCollection({ items: ['alpha', 'beta'] })
const openCases: [string, Hook, Record<string, unknown>][] = [
  ['calendar', useCalendar, {}],
  ['collapsible', useCollapsible, {}],
  ['color-picker', useColorPicker, {}],
  ['combobox', useCombobox, { collection }],
  ['dialog', useDialog, { modal: false }],
  ['floating-panel', useFloatingPanel, {}],
  ['hover-card', useHoverCard, { openDelay: 0, closeDelay: 0 }],
  ['menu', useMenu, {}],
  ['popover', usePopover, {}],
  ['select', useSelect, { collection }],
  ['tooltip', useTooltip, {}],
]

function unwrap(result: any) {
  return result.api ?? result
}

function parts(api: any): ReactNode {
  return (
    <div {...api.getRootProps?.()}>
      {api.getTriggerProps && <button {...api.getTriggerProps()}>Trigger</button>}
      {api.getInputProps && <input {...api.getInputProps()} />}
      {api.getPositionerProps
        ? <div {...api.getPositionerProps()}><div {...api.getContentProps?.()} /></div>
        : api.getContentProps && <div {...api.getContentProps()} />}
    </div>
  )
}

async function mountHook(hook: Hook, initialProps: any, children = parts) {
  const container = document.createElement('div')
  document.body.append(container)
  const root = createRoot(container)
  roots.push(root)
  let api: any
  function Harness(props: any) {
    'use no memo'
    // Exposing the latest API to the test is intentionally outside compilation.
    api = unwrap(hook(props))
    return children(api)
  }
  const render = async (props: any) => {
    await act(async () => root.render(createElement(Harness, props)))
  }
  await render(initialProps)
  return {
    get api() { return api },
    container,
    root,
    render,
    async change(action: (api: any) => void) {
      await act(async () => {
        action(api)
        await new Promise<void>(resolve => setTimeout(resolve, 0))
      })
    },
  }
}

function ssrHook(hook: Hook, props: any, read: (api: any) => ReactNode) {
  function Probe() {
    'use no memo'
    return <output>{read(unwrap(hook(props)))}</output>
  }
  return renderToString(<Probe />)
}

describe('live open wins over defaultOpen at the first render', () => {
  for (const [name, hook, required] of openCases) {
    it.each([true, false])(`${name}: open=%s in SSR and mounted DOM`, async (open) => {
      const props = { ...required, open, defaultOpen: !open }
      expect(ssrHook(hook, props, api => String(api.open))).toBe(`<output>${open}</output>`)
      const harness = await mountHook(hook, props)
      expect(harness.api.open).toBe(open)
      const statePart = harness.container.querySelector('[data-state]')
      expect(statePart?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
    })
  }
})

// This is an API ownership contract, not a pointer-interaction test. Chromium
// can deliver a trusted pointerenter at (0, 0) when the previous fixture is
// replaced underneath its cursor. Park outside before mounting HoverCard so
// that newer native input cannot legitimately supersede the API close request.
// The ordinary HoverCard browser suite separately verifies that reopening path.
async function parkNativePointer() {
  // Happy DOM has no native pointer. Import the browser-only module exclusively
  // inside Vitest's browser runtime (the repository pins Vitest 4.0.17).
  if (!('__vitest_browser_runner__' in globalThis))
    return
  const { userEvent } = await import('vitest/browser')
  const parking = document.createElement('div')
  parking.setAttribute('aria-hidden', 'true')
  Object.assign(parking.style, {
    position: 'fixed',
    right: '0px',
    bottom: '0px',
    width: '8px',
    height: '8px',
  })
  document.body.append(parking)
  await userEvent.hover(parking)
  // Keep the target until the existing afterEach cleans up the document.
}

describe('undefined live open preserves uncontrolled ownership', () => {
  for (const [name, hook, required] of openCases) {
    it(`${name}: opens and closes twice, including API and DOM state`, async () => {
      if (name === 'hover-card')
        await parkNativePointer()
      const onOpenChange = vi.fn()
      const harness = await mountHook(hook, { ...required, open: undefined, defaultOpen: false, onOpenChange })
      for (const open of [true, false, true, false]) {
        await harness.change(api => api.setOpen(open))
        await vi.waitFor(() => {
          expect(harness.api.open).toBe(open)
          expect(harness.container.querySelector('[data-state]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
        })
        await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open })))
      }
    })
  }
})

// Deterministic geometry isolates ownership from layout in this hook suite.
// The component's browser tests separately exercise real carousel layout.
function carouselGeometry(node: HTMLDivElement | null, index = -1) {
  if (!node)
    return
  Object.defineProperties(node, {
    offsetWidth: { configurable: true, value: 100 },
    scrollWidth: { configurable: true, value: index < 0 ? 500 : 100 },
  })
  node.getBoundingClientRect = () => new DOMRect(index < 0 ? 0 : index * 100, 0, 100, 100)
}

function carouselParts(api: any) {
  return (
    <div {...api.getRootProps()}>
      <div
        {...api.getItemGroupProps()}
        style={{ width: '100px', scrollPaddingLeft: '0px', scrollPaddingRight: '0px', scrollPaddingTop: '0px', scrollPaddingBottom: '0px' }}
        ref={node => carouselGeometry(node)}
      >
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            {...api.getItemProps({ index })}
            style={{ width: '100px', height: '100px', scrollSnapAlign: 'start' }}
            ref={node => carouselGeometry(node, index)}
          />
        ))}
      </div>
      <button {...api.getIndicatorProps({ index: 1 })}>Page 2</button>
      <button {...api.getIndicatorProps({ index: 2 })}>Page 3</button>
    </div>
  )
}

function setSplitterSize(api: any, value: { id: string, size: number }[]) {
  // Decrease before increasing so every intermediate size remains valid.
  const delta = (panel: typeof value[number]) => panel.size - Number(api.getPanelProps({ id: panel.id }).style.flexGrow)
  const ordered = [...value].sort((a, b) => delta(a) - delta(b))
  for (const panel of ordered)
    api.setSize(panel.id, panel.size)
}

function splitterParts(api: any) {
  return (
    <div {...api.getRootProps()}>
      <div {...api.getPanelProps({ id: 'a' })} />
      <div {...api.getResizeTriggerProps({ id: 'a:b' })} />
      <div {...api.getPanelProps({ id: 'b' })} />
    </div>
  )
}

function toggleGroupItem(api: any, value: string[]) {
  document.getElementById(api.getItemProps({ value: value[0] }).id)!.click()
}

function toggleGroupParts(api: any) {
  return (
    <div {...api.getRootProps()}>
      <button {...api.getItemProps({ value: 'alpha' })}>Alpha</button>
      <button {...api.getItemProps({ value: 'beta' })}>Beta</button>
    </div>
  )
}

interface ValueCase {
  name: string
  hook: Hook
  field: string
  initial: any
  next: any
  props?: Record<string, unknown>
  read?: (api: any) => any
  set?: (api: any, value: any) => void
  render?: (api: any) => ReactNode
}
const valueCases: ValueCase[] = [
  { name: 'carousel page', hook: useCarousel, field: 'page', initial: 1, next: 2, props: { slideCount: 5 }, set: (api, value) => api.scrollTo(value, true), render: carouselParts },
  { name: 'splitter size', hook: useSplitter, field: 'size', initial: [{ id: 'a', size: 50 }, { id: 'b', size: 50 }], next: [{ id: 'a', size: 70 }, { id: 'b', size: 30 }], read: api => ['a', 'b'].map(id => ({ id, size: api.getPanelProps({ id }).style.flexGrow })), set: setSplitterSize, render: splitterParts },
  { name: 'calendar value', hook: useCalendar, field: 'value', initial: [parseDate('2026-09-01')], next: [parseDate('2026-09-02')], read: api => api.value.map(String) },
  { name: 'checkbox checked', hook: useCheckbox, field: 'checked', initial: true, next: false },
  { name: 'collapse value', hook: useCollapse, field: 'value', initial: ['alpha'], next: ['beta'] },
  { name: 'color-picker value', hook: useColorPicker, field: 'value', initial: parseColor('#ff0000'), next: parseColor('#00ff00'), read: api => api.value.toString('hex') },
  { name: 'combobox value', hook: useCombobox, field: 'value', initial: ['alpha'], next: ['beta'], props: { collection } },
  { name: 'combobox inputValue', hook: useCombobox, field: 'inputValue', initial: 'alpha', next: 'beta', props: { collection } },
  { name: 'edit value', hook: useEdit, field: 'value', initial: 'alpha', next: 'beta' },
  { name: 'navigation-menu value', hook: useNavigationMenu, field: 'value', initial: 'alpha', next: 'beta', render: api => <div {...api.getRootProps()} /> },
  { name: 'number-input value', hook: useNumberInput, field: 'value', initial: '12', next: '24' },
  { name: 'otp-input value', hook: useOtpInput, field: 'value', initial: ['1', '2'], next: ['3', '4'], render: api => <div {...api.getRootProps()}><input {...api.getInputProps({ index: 0 })} /><input {...api.getInputProps({ index: 1 })} /></div> },
  { name: 'pagination page', hook: usePagination, field: 'page', initial: 2, next: 3, props: { count: 100 } },
  { name: 'pagination pageSize', hook: usePagination, field: 'pageSize', initial: 10, next: 25, props: { count: 100 } },
  { name: 'radio value', hook: useRadio, field: 'value', initial: 'alpha', next: 'beta' },
  { name: 'select value', hook: useSelect, field: 'value', initial: ['alpha'], next: ['beta'], props: { collection } },
  { name: 'slider value', hook: useSlider, field: 'value', initial: [20], next: [40] },
  { name: 'steps step', hook: useSteps, field: 'step', initial: 1, next: 2, props: { count: 4 }, read: api => api.value, render: api => <div {...api.getRootProps()} /> },
  { name: 'switch checked', hook: useSwitch, field: 'checked', initial: true, next: false },
  { name: 'tabs value', hook: useTabs, field: 'value', initial: 'alpha', next: 'beta', render: api => <div {...api.getRootProps()} /> },
  { name: 'toggle-group value', hook: useToggleGroup, field: 'value', initial: ['alpha'], next: ['beta'], set: toggleGroupItem, render: toggleGroupParts },
  { name: 'tree selectedValue', hook: useTree, field: 'selectedValue', initial: ['src'], next: ['src/app.tsx'], props: { collection: createFileTreeCollection(['src/app.tsx', 'lib/index.ts']) } },
  { name: 'tree expandedValue', hook: useTree, field: 'expandedValue', initial: ['src'], next: ['lib'], props: { collection: createFileTreeCollection(['src/app.tsx', 'lib/index.ts']) } },
]

describe('undefined live values in public hooks remain mutable', () => {
  for (const row of valueCases) {
    it(row.name, async () => {
      const suffix = row.field[0].toUpperCase() + row.field.slice(1)
      const read = row.read ?? ((api: any) => api[row.field])
      const getExpected = (value: any) => row.name === 'color-picker value' ? value.toString('hex') : row.name === 'calendar value' ? value.map(String) : value
      const set = row.set ?? ((api: any, value: any) => api[`set${suffix}`](value))
      const props = { ...row.props, [row.field]: undefined, [`default${suffix}`]: row.initial }
      const harness = await mountHook(row.hook, props, api => <>{(row.render ?? parts)(api)}<output>{JSON.stringify(read(api))}</output></>)
      const check = async (value: any) => {
        const expected = getExpected(value)
        await vi.waitFor(() => {
          expect(read(harness.api)).toEqual(expected)
          expect(harness.container.querySelector('output')?.textContent).toBe(JSON.stringify(expected))
        })
      }
      await check(row.initial)
      await harness.change(api => set(api, row.next))
      await check(row.next)
      await harness.render({ ...props, [`default${suffix}`]: row.next, id: `rerender-${row.name}` })
      await check(row.next)
      await harness.change(api => set(api, row.initial))
      await check(row.initial)
    })
  }
})

for (const entry of ['hook', 'root', 'provider'] as const) {
  it(`checkbox ${entry}: input, machine and visual state agree after repeated clicks`, async () => {
    const onCheckedChange = vi.fn()
    let latest: any
    function Content() {
      return (
        <>
          <Checkbox.Label>Ownership checkbox</Checkbox.Label>
          <Checkbox.Control />
          <Checkbox.HiddenInput />
          <Checkbox.Context>
            {(api) => {
              latest = api
              return <output>{String(api.checked)}</output>
            }}
          </Checkbox.Context>
        </>
      )
    }
    const children = (api: any) => {
      latest = api
      if (entry === 'provider')
        return <Checkbox.RootProvider value={api}><Content /></Checkbox.RootProvider>
      return <label {...api.getRootProps()}><span {...api.getLabelProps()}>Ownership checkbox</span><span {...api.getControlProps()} /><input {...api.getHiddenInputProps()} /><output>{String(api.checked)}</output></label>
    }
    const props = { defaultChecked: true, checked: undefined, onCheckedChange }
    const harness = await mountHook(entry === 'root' ? () => ({}) : useCheckbox, props, entry === 'root' ? () => <Checkbox.Root {...props}><Content /></Checkbox.Root> : children)
    for (const checked of [true, false, true, false]) {
      if (checked !== latest.checked) {
        await act(async () => (harness.container.querySelector('input') as HTMLInputElement).click())
      }
      await vi.waitFor(() => {
        expect(latest.checked).toBe(checked)
        expect(harness.container.querySelector('output')?.textContent).toBe(String(checked))
        expect(harness.container.querySelector('input')?.checked).toBe(checked)
        expect(harness.container.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe(checked ? 'checked' : 'unchecked')
      })
    }
    expect(onCheckedChange.mock.calls.map(([detail]) => detail.checked)).toEqual([false, true, false])
  })
}

it('controlled checkbox requests changes, waits for parent writeback, then renders the new state', async () => {
  const onCheckedChange = vi.fn()
  const harness = await mountHook(useCheckbox, { checked: true, defaultChecked: false, onCheckedChange }, api => <label {...api.getRootProps()}><span {...api.getControlProps()} /><input {...api.getHiddenInputProps()} /></label>)
  await harness.change(api => api.setChecked(false))
  expect(onCheckedChange).toHaveBeenLastCalledWith({ checked: false })
  expect(harness.api.checked).toBe(true)
  expect(harness.container.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('checked')
  await harness.render({ checked: false, defaultChecked: true, onCheckedChange })
  await vi.waitFor(() => {
    expect(harness.api.checked).toBe(false)
    expect(harness.container.querySelector('input')?.checked).toBe(false)
    expect(harness.container.querySelector('[data-part="control"]')?.getAttribute('data-state')).toBe('unchecked')
  })
})

it('dialog.Root separate split preserves undefined open as uncontrolled', async () => {
  let dialog: any
  const harness = await mountHook(() => ({}), {}, () => (
    <Dialog.Root open={undefined} defaultOpen={false} modal={false}>
      <Dialog.Trigger>Toggle</Dialog.Trigger>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Dialog</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
        </Dialog.Content>
      </Dialog.Positioner>
      <Dialog.Context>
        {(api) => {
          dialog = api
          return <output>{String(api.open)}</output>
        }}
      </Dialog.Context>
    </Dialog.Root>
  ))
  for (const open of [true, false, true, false]) {
    await act(async () => dialog.setOpen(open))
    await vi.waitFor(() => {
      expect(dialog.open).toBe(open)
      expect(harness.container.querySelector('output')?.textContent).toBe(String(open))
      expect(harness.container.querySelector('[data-part="trigger"]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
    })
  }
})

it('calendar defaultView seeds SSR and never replays after view changes or prop rerenders', async () => {
  expect(ssrHook(useCalendar, { defaultView: 'year' }, api => api.view)).toBe('<output>year</output>')
  const harness = await mountHook(useCalendar, { defaultView: 'year', view: undefined }, api => <Calendar.RootProvider value={api}><Calendar.View view="day">Day</Calendar.View><Calendar.View view="month">Month</Calendar.View><Calendar.View view="year">Year</Calendar.View><output>{api.view}</output></Calendar.RootProvider>)
  expect(harness.api.view).toBe('year')
  expect(harness.container.querySelectorAll('[data-part="view"]')[2].hasAttribute('hidden')).toBe(false)
  await harness.change(api => api.setView('month'))
  await harness.render({ defaultView: 'day', view: undefined, disabled: true })
  await vi.waitFor(() => {
    expect(harness.api.view).toBe('month')
    expect(harness.container.querySelector('output')?.textContent).toBe('month')
    expect(harness.container.querySelectorAll('[data-part="view"]')[1].hasAttribute('hidden')).toBe(false)
  })
})

it('calendar.Root honors live view over defaultView and displays its initial view', async () => {
  const harness = await mountHook(() => ({}), {}, () => <Calendar.Root defaultView="year" view="month"><Calendar.View view="month">Month</Calendar.View><Calendar.View view="year">Year</Calendar.View><Calendar.Context>{api => <output>{api.view}</output>}</Calendar.Context></Calendar.Root>)
  expect(harness.container.querySelector('output')?.textContent).toBe('month')
  expect(harness.container.querySelector('[data-part="view"]')?.hasAttribute('hidden')).toBe(false)
})

it('edit defaultEdit seeds SSR, supports submit/cancel, and never replays its initial value', async () => {
  expect(ssrHook(useEdit, { defaultEdit: true }, api => String(api.editing))).toBe('<output>true</output>')
  const onEditChange = vi.fn()
  const onValueCommit = vi.fn()
  const onValueRevert = vi.fn()
  const props = { defaultEdit: true, edit: undefined, defaultValue: 'alpha', onEditChange, onValueCommit, onValueRevert }
  const harness = await mountHook(useEdit, props, api => <Edit.RootProvider value={api}><Edit.Area><Edit.Preview /><Edit.Input /></Edit.Area><Edit.EditTrigger>Edit</Edit.EditTrigger><Edit.SubmitTrigger>Submit</Edit.SubmitTrigger><Edit.CancelTrigger>Cancel</Edit.CancelTrigger><output>{String(api.editing)}</output></Edit.RootProvider>)
  expect(harness.api.editing).toBe(true)
  expect(harness.container.querySelector('input')?.hidden).toBe(false)
  await harness.change(api => api.setValue('beta'))
  await harness.change(api => api.submit())
  await vi.waitFor(() => expect(harness.api.editing).toBe(false))
  expect(onValueCommit).toHaveBeenLastCalledWith({ value: 'beta' })
  await harness.render({ ...props, defaultEdit: false })
  await harness.render({ ...props, defaultValue: 'replacement' })
  expect(harness.api.editing).toBe(false)
  expect(harness.container.querySelector('input')?.hidden).toBe(true)
  await harness.change(api => api.edit())
  await vi.waitFor(() => expect(harness.api.editing).toBe(true))
  await harness.change(api => api.setValue('gamma'))
  await harness.change(api => api.cancel())
  await vi.waitFor(() => expect(harness.api.editing).toBe(false))
  expect(harness.api.value).toBe('beta')
  expect(onValueRevert).toHaveBeenLastCalledWith({ value: 'beta' })
  expect(onEditChange.mock.calls.map(([detail]) => detail.edit)).toEqual([false, true, false])
})

it('edit.Root live false vetoes defaultEdit and requires writeback after an edit request', async () => {
  const onEditChange = vi.fn()
  let edit: any
  function Fixture(props: any) {
    return (
      <Edit.Root {...props}>
        <Edit.Area><Edit.Preview /><Edit.Input /></Edit.Area>
        <Edit.EditTrigger>Edit</Edit.EditTrigger>
        <Edit.Context>
          {(api) => {
            edit = api
            return <output>{String(api.editing)}</output>
          }}
        </Edit.Context>
      </Edit.Root>
    )
  }
  const harness = await mountHook((props: any) => props, { edit: false, defaultEdit: true, onEditChange }, props => <Fixture {...props} />)
  expect(edit.editing).toBe(false)
  await act(async () => edit.edit())
  expect(onEditChange).toHaveBeenLastCalledWith({ edit: true })
  expect(edit.editing).toBe(false)
  await harness.render({ edit: true, defaultEdit: false, onEditChange })
  await vi.waitFor(() => {
    expect(edit.editing).toBe(true)
    expect(harness.container.querySelector('input')?.hidden).toBe(false)
  })
  await act(async () => edit.submit())
  expect(onEditChange).toHaveBeenLastCalledWith({ edit: false })
  expect(edit.editing).toBe(true)
  await harness.render({ edit: false, defaultEdit: true, onEditChange })
  await vi.waitFor(() => {
    expect(edit.editing).toBe(false)
    expect(harness.container.querySelector('input')?.hidden).toBe(true)
  })
})

describe('controlled open requests wait for parent writeback', () => {
  for (const [name, hook, required] of openCases) {
    it(`${name}: repeated requests preserve parent ownership`, async () => {
      const onOpenChange = vi.fn()
      const harness = await mountHook(hook, { ...required, open: false, defaultOpen: true, onOpenChange })
      for (const open of [true, false]) {
        await harness.change(api => api.setOpen(open))
        await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open })))
        expect(harness.api.open).toBe(!open)
        expect(harness.container.querySelector('[data-state]')?.getAttribute('data-state')).toBe(open ? 'closed' : 'open')
        await harness.render({ ...required, open, defaultOpen: !open, onOpenChange })
        await vi.waitFor(() => {
          expect(harness.api.open).toBe(open)
          expect(harness.container.querySelector('[data-state]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
        })
      }
    })
  }
})

describe('controlled value fields request changes and follow parent writeback', () => {
  for (const row of valueCases) {
    it(row.name, async () => {
      const suffix = row.field[0].toUpperCase() + row.field.slice(1)
      const callback = row.field === 'selectedValue' ? 'onSelectionChange' : row.field === 'expandedValue' ? 'onExpandedChange' : `on${suffix}Change`
      const onChange = vi.fn()
      const read = row.read ?? ((api: any) => api[row.field])
      const expected = (value: any) => row.name === 'color-picker value' ? value.toString('hex') : row.name === 'calendar value' ? value.map(String) : value
      const next = row.field === 'size' ? [{ id: 'a', size: 30 }, { id: 'b', size: 50 }] : row.next
      const set = row.field === 'size' ? (api: any, value: any) => api.setSize('a', value[0].size) : row.set ?? ((api: any, value: any) => api[`set${suffix}`](value))
      const props = { ...row.props, [row.field]: row.initial, [`default${suffix}`]: next, [callback]: onChange }
      const harness = await mountHook(row.hook, props, api => <>{(row.render ?? parts)(api)}<output>{JSON.stringify(read(api))}</output></>)
      const check = async (value: any) => {
        await vi.waitFor(() => {
          expect(read(harness.api)).toEqual(expected(value))
          expect(harness.container.querySelector('output')?.textContent).toBe(JSON.stringify(expected(value)))
        })
      }
      await check(row.initial)
      let current = row.initial
      for (const value of [next, row.initial]) {
        await harness.render({ ...props, [row.field]: current, [`default${suffix}`]: value })
        await check(current)
        await harness.change(api => set(api, value))
        await vi.waitFor(() => expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({ [row.field]: value })))
        await check(current)
        await harness.render({ ...props, [row.field]: value })
        await check(value)
        current = value
      }
    })
  }
})

it('exported indeterminate example can be checked and unchecked', async () => {
  const harness = await mountHook(() => ({}), {}, () => <Indeterminate />)
  const input = harness.container.querySelector('input')!
  const control = harness.container.querySelector('[data-part="control"]')!
  expect(control.getAttribute('data-state')).toBe('indeterminate')
  for (const checked of [true, false]) {
    await act(async () => input.click())
    expect(input.checked).toBe(checked)
    expect(control.getAttribute('data-state')).toBe(checked ? 'checked' : 'unchecked')
  }
})

it('exported Splitter RootProvider example maximizes twice without invalid panel totals', async () => {
  const harness = await mountHook(() => ({}), {}, () => <SplitterRootProvider />)
  const sizes = () => Array.from(harness.container.querySelectorAll<HTMLElement>('[data-part="panel"]')).map(panel => panel.style.flexGrow)
  expect(sizes()).toEqual(['50', '50'])
  for (let i = 0; i < 2; i++) {
    await act(async () => harness.container.querySelector('button')!.click())
    expect(sizes()).toEqual(['100', '0'])
  }
})

it('exported Select InitialValue example sends detail callbacks through actual controls', async () => {
  const onValueChange = vi.fn()
  const onOpenChange = vi.fn()
  const harness = await mountHook(() => ({}), {}, () => <SelectInitialValue onValueChange={onValueChange} onOpenChange={onOpenChange} />)
  await act(async () => harness.container.querySelector<HTMLElement>('[data-part="clear-trigger"]')!.click())
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: [], items: [] }))
  await act(async () => harness.container.querySelector<HTMLElement>('[data-part="trigger"]')!.click())
  expect(onOpenChange).toHaveBeenLastCalledWith({ open: true })
  await act(async () => harness.container.querySelector<HTMLElement>('[data-part="item"][data-value="react"]')!.click())
  expect(onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ['react'] }))
  expect(harness.container.querySelector('[data-part="value-text"]')?.textContent).toBe('React')
  expect(onOpenChange).toHaveBeenLastCalledWith({ open: false })
})

it('exported Tree InitialValue example seeds selection and expansion and allows repeated toggles', async () => {
  const harness = await mountHook(() => ({}), {}, () => <TreeInitialValue />)
  const src = harness.container.querySelector('[data-part="branch"][data-value="src"]')!
  expect(src.getAttribute('aria-selected')).toBe('true')
  expect(src.getAttribute('aria-expanded')).toBe('true')
  expect(harness.container.querySelector('[data-part="branch"][data-value="node_modules"]')?.getAttribute('aria-expanded')).toBe('true')
  for (const expanded of [false, true]) {
    await act(async () => harness.container.querySelector<HTMLElement>('[data-part="branch-trigger"][data-value="src"]')!.click())
    expect(src.getAttribute('aria-expanded')).toBe(String(expanded))
    expect(src.getAttribute('data-state')).toBe(expanded ? 'open' : 'closed')
    expect(src.getAttribute('aria-selected')).toBe('true')
  }
})

const openComponents: Record<string, any> = { 'calendar': Calendar, 'collapsible': Collapsible, 'color-picker': ColorPicker, 'combobox': Combobox, 'dialog': Dialog, 'floating-panel': FloatingPanel, 'hover-card': HoverCard, 'menu': Menu, 'popover': Popover, 'select': Select, 'tooltip': Tooltip }
describe('root components preserve live open priority after mounting', () => {
  for (const [name, , required] of openCases) {
    it.each([true, false])(`${name} Root open=%s`, async (open) => {
      const Component = openComponents[name]
      let latest: any
      const content = <Component.Content />
      const harness = await mountHook(() => ({}), {}, () => (
        <Component.Root {...required} open={open} defaultOpen={!open}>
          <Component.Trigger>Trigger</Component.Trigger>
          {Component.Positioner ? <Component.Positioner>{content}</Component.Positioner> : content}
          <Component.Context>
            {(api: any) => {
              latest = api
              return <output>{String(api.open)}</output>
            }}
          </Component.Context>
        </Component.Root>
      ))
      expect(latest.open).toBe(open)
      expect(harness.container.querySelector('output')?.textContent).toBe(String(open))
      expect(harness.container.querySelector('[data-part="trigger"]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
    })
  }
})

it('dialog RootProvider keeps undefined live open interactive across repeated cycles', async () => {
  const harness = await mountHook(useDialog, { open: undefined, defaultOpen: false, modal: false }, api => (
    <Dialog.RootProvider value={api}>
      <Dialog.Trigger>Toggle</Dialog.Trigger>
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Dialog</Dialog.Title>
          <Dialog.Description>Description</Dialog.Description>
          <Dialog.CloseTrigger>Close</Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
      <output>{String(api.open)}</output>
    </Dialog.RootProvider>
  ))
  expect(harness.container.querySelector<HTMLElement>('[data-part="content"]')?.hidden).toBe(true)
  for (const open of [true, false, true, false]) {
    await harness.change(api => api.setOpen(open))
    await vi.waitFor(() => {
      expect(harness.api.open).toBe(open)
      expect(harness.container.querySelector('[data-part="trigger"]')?.getAttribute('data-state')).toBe(open ? 'open' : 'closed')
      expect(harness.container.querySelector<HTMLElement>('[data-part="content"]')?.hidden).toBe(!open)
    })
  }
})

it('popover Root preserves wrapper identity, local attributes and click handlers', async () => {
  const onClick = vi.fn()
  const harness = await mountHook(() => ({}), {}, () => (
    <Popover.Root id="target" className="custom-popover" data-testid="popover" open={false} defaultOpen positioning={{ placement: 'top' }} onClick={onClick}>
      <Popover.Trigger>Trigger</Popover.Trigger>
      <Popover.Content>Content</Popover.Content>
    </Popover.Root>
  ))
  const wrapper = harness.container.querySelector<HTMLElement>('[data-testid="popover"]')!
  expect(wrapper.id).toBe('target')
  expect(wrapper.className).toBe('custom-popover')
  expect(wrapper.getAttribute('data-testid')).toBe('popover')
  expect(wrapper.hasAttribute('defaultopen')).toBe(false)
  expect(wrapper.hasAttribute('positioning')).toBe(false)
  expect(harness.container.querySelector('[data-part="trigger"]')?.id).toBe('popover:target:trigger')
  expect(harness.container.querySelector('[data-part="content"]')?.id).toBe('popover:target:content')
  await act(async () => wrapper.click())
  expect(onClick).toHaveBeenCalledTimes(1)
})

// The same scenario descriptions are consumed by all four runtime suites.
// Keep hook mounting, React act(), and compiler integration local to React.
const sharedValueCases: ValueCase[] = [
  ...valueCases.filter(row => /^(?:checkbox|number-input|combobox|calendar|tree) /.test(row.name)),
  { name: 'dialog open', hook: useDialog, field: 'open', initial: false, next: true, props: { modal: false, closeOnInteractOutside: false } },
]
it('shared contract coverage includes every target field', () => assertOwnershipCoverage(sharedValueCases.map(row => row.name)))
for (const row of sharedValueCases) {
  for (const scenario of ownershipScenarios) {
    it(`shared contract: ${row.name}: ${scenario.name}`, async () => {
      const suffix = row.field[0].toUpperCase() + row.field.slice(1)
      const callback = row.field === 'selectedValue' ? 'onSelectionChange' : row.field === 'expandedValue' ? 'onExpandedChange' : `on${suffix}Change`
      const onChange = vi.fn()
      const values = { initial: row.initial, next: row.next }
      const format = (value: any) => JSON.stringify(row.field === 'value' && row.name.startsWith('calendar') ? value.map(String) : value)
      const props = { ...row.props, [row.field]: scenario.controlled ? row.initial : undefined, [`default${suffix}`]: values[scenario.defaultValue], [callback]: onChange }
      const harness = await mountHook(row.hook, props, api => <>{parts(api)}<output data-contract>{format(api[row.field])}</output></>)
      const check = (value: unknown, requests: unknown[]) => vi.waitFor(() => assertOwnershipSnapshot({
        api: format(harness.api[row.field]),
        rendered: harness.container.querySelector('[data-contract]')?.textContent,
        requests: onChange.mock.calls.map(([details]) => format(details[row.field])),
      }, format(value), requests.map(format)))
      await check(row.initial, [])
      for (const step of scenario.steps) {
        if (step.action === 'request') {
          await harness.change(api => api[`set${suffix}`](values[step.value]))
          if (scenario.accept) {
            props[row.field] = values[step.value]
            await harness.render({ ...props })
          }
        }
        else {
          if (step.action === 'parent')
            props[row.field] = values[step.value]
          if (step.action === 'default')
            props[`default${suffix}`] = values[step.value]
          await harness.render({ ...props })
        }
        await check(values[step.expected], step.requests.map(value => values[value]))
      }
    })
  }
}

it('shared dialog lifecycle: restores focus twice and disposes document keydown listeners on unmount', async () => {
  const onOpenChange = vi.fn()
  const harness = await mountHook(useDialog, { 'defaultOpen': false, 'preventScroll': false, 'aria-label': 'Contract dialog', onOpenChange }, api => (
    <>
      <button data-contract-trigger {...api.getTriggerProps()}>Open</button>
      <div {...api.getPositionerProps()}><div {...api.getContentProps()}><button {...api.getCloseTriggerProps()}>Close</button></div></div>
    </>
  ))
  const trigger = harness.container.querySelector<HTMLButtonElement>('[data-contract-trigger]')!
  const listeners = trackDocumentListeners(trigger.ownerDocument, 'keydown')
  try {
    for (const close of ['api', 'escape']) {
      await harness.change(() => {
        trigger.focus()
        trigger.click()
      })
      await vi.waitFor(() => expect(harness.api.open).toBe(true))
      await vi.waitFor(() => expect(harness.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
      await vi.waitFor(() => listeners.expectActive())
      await harness.change(api => close === 'api' ? api.setOpen(false) : document.activeElement!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })))
      await vi.waitFor(() => {
        expect(harness.api.open).toBe(false)
        assertFocusRestored(trigger)
        listeners.expectEmpty()
      })
    }
    await harness.change(() => trigger.click())
    await vi.waitFor(() => expect(harness.api.open).toBe(true))
    await vi.waitFor(() => expect(harness.container.querySelector('[data-part="content"]')?.contains(document.activeElement)).toBe(true))
    await vi.waitFor(() => listeners.expectActive())
    await act(async () => harness.root.unmount())
    roots.splice(roots.indexOf(harness.root), 1)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 35))
    expect(onOpenChange.mock.calls.map(([details]) => details.open)).toEqual([true, false, true, false, true])
    await vi.waitFor(() => listeners.expectEmpty())
  }
  finally {
    listeners.restore()
  }
})

import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { Calendar, useCalendar } from '~/components/calendar'
import { Collapsible, useCollapsible } from '~/components/collapsible'
import { ColorPicker, useColorPicker } from '~/components/color-picker'
import { Combobox, useCombobox } from '~/components/combobox'
import { Dialog, useDialog } from '~/components/dialog'
import { splitDialogProps } from '~/components/dialog/hooks/split-dialog-props'
import { Edit, useEdit } from '~/components/edit'
import { FloatingPanel, useFloatingPanel } from '~/components/floating-panel'
import { HoverCard, useHoverCard } from '~/components/hover-card'
import { Menu, useMenu } from '~/components/menu'
import { NavigationMenu } from '~/components/navigation-menu'
import { Popover, usePopover } from '~/components/popover'
import { Select, useSelect } from '~/components/select'
import { Tooltip, useTooltip } from '~/components/tooltip'
import { createListCollection } from '~/utils/collection'
import { normalizeMachineProps } from '~/utils/normalize-machine-props'

const collection = createListCollection({ items: ['alpha', 'beta'] })
const cases = [
  { name: 'calendar', hook: useCalendar, component: Calendar, props: {} },
  { name: 'collapsible', hook: useCollapsible, component: Collapsible, props: {} },
  { name: 'color-picker', hook: useColorPicker, component: ColorPicker, props: {} },
  { name: 'combobox', hook: useCombobox, component: Combobox, props: { collection } },
  { name: 'dialog', hook: useDialog, component: Dialog, props: {} },
  { name: 'floating-panel', hook: useFloatingPanel, component: FloatingPanel, props: {} },
  { name: 'hover-card', hook: useHoverCard, component: HoverCard, props: {} },
  { name: 'menu', hook: useMenu, component: Menu, props: {} },
  { name: 'popover', hook: usePopover, component: Popover, props: {} },
  { name: 'select', hook: useSelect, component: Select, props: { collection } },
  { name: 'tooltip', hook: useTooltip, component: Tooltip, props: {} },
]

function renderHook(hook: (props: any) => any, props: any, field: string) {
  function Probe() {
    'use no memo'
    const result = hook(props)
    const api = result.api ?? result
    return <output>{String(api[field])}</output>
  }
  return renderToString(<Probe />)
}

it('runs without browser globals', () => {
  expect(typeof document).toBe('undefined')
  expect(typeof window).toBe('undefined')
})

describe('all open families give live props SSR priority at both public boundaries', () => {
  for (const { name, hook, component, props } of cases) {
    it.each([true, false])(`${name}: open=%s`, (open) => {
      const input: Record<string, unknown> = { ...props, open, defaultOpen: !open }
      expect(renderHook(hook, input, 'open')).toBe(`<output>${open}</output>`)
      const Root = component.Root as any
      const Context = component.Context as any
      const markup = renderToString(createElement(Root, input, createElement(Context, {
        children: (api: any) => <output>{String(api.open)}</output>,
      })))
      expect(markup).toContain(`<output>${open}</output>`)
    })
  }
})

it.each(['month', 'year'] as const)('calendar defaultView=%s works through hook and Root', (defaultView) => {
  expect(renderHook(useCalendar, { defaultView, view: undefined }, 'view')).toBe(`<output>${defaultView}</output>`)
  expect(renderToString(<Calendar.Root defaultView={defaultView}><Calendar.Context>{api => <output>{api.view}</output>}</Calendar.Context></Calendar.Root>)).toContain(`<output>${defaultView}</output>`)
  expect(renderHook(useCalendar, { defaultView, view: 'day' }, 'view')).toBe('<output>day</output>')
})

it.each([
  { defaultEdit: true, edit: undefined, expected: true },
  { defaultEdit: true, edit: false, expected: false },
  { defaultEdit: false, edit: true, expected: true },
  { defaultEdit: false, edit: undefined, expected: false },
])('edit defaults and live priority: %j', ({ expected, ...props }) => {
  expect(renderHook(useEdit, props, 'editing')).toBe(`<output>${expected}</output>`)
  expect(renderToString(<Edit.Root {...props}><Edit.Context>{api => <output>{String(api.editing)}</output>}</Edit.Context></Edit.Root>)).toContain(`<output>${expected}</output>`)
})

it('normalizes only undefined and conflicting defaultOpen without mutating caller props', () => {
  const props = { open: false, defaultOpen: true, value: undefined, checked: false, page: 0, text: '', nullable: null }
  expect(normalizeMachineProps(props)).toEqual({ open: false, checked: false, page: 0, text: '', nullable: null })
  expect(Object.hasOwn(props, 'value')).toBe(true)
  expect(props.defaultOpen).toBe(true)
  expect(normalizeMachineProps({ open: undefined, defaultOpen: true })).toEqual({ defaultOpen: true })
})

it('dialog standalone split also omits undefined live keys', () => {
  const [props, local] = splitDialogProps({ 'open': undefined, 'defaultOpen': true, 'data-testid': 'dialog' })
  expect(Object.hasOwn(props, 'open')).toBe(false)
  expect(props.defaultOpen).toBe(true)
  expect(local).toEqual({ 'data-testid': 'dialog' })
})

it('popover Root keeps machine props off its DOM wrapper while preserving local props', () => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    const markup = renderToString(<Popover.Root defaultOpen open={false} positioning={{ placement: 'top' }} data-testid="popover">Content</Popover.Root>)
    expect(markup).toBe('<div data-testid="popover">Content</div>')
    expect(errors).not.toHaveBeenCalled()
  }
  finally {
    errors.mockRestore()
  }
})

it('popover Root preserves an explicit wrapper id and uses it for machine part ids', () => {
  const markup = renderToString(
    <Popover.Root id="target" className="custom-popover" data-testid="popover" open={false} defaultOpen positioning={{ placement: 'top' }} onClick={() => {}}>
      <Popover.Trigger>Trigger</Popover.Trigger>
      <Popover.Content>Content</Popover.Content>
    </Popover.Root>,
  )
  expect(markup).toContain('<div id="target" class="custom-popover" data-testid="popover">')
  expect(markup).toContain('id="popover:target:trigger"')
  expect(markup).toContain('id="popover:target:content"')
  expect(markup).not.toMatch(/(?:defaultOpen|defaultopen|positioning)=/)
})

it('navigation menu renders the seeded Root value before any browser pointer input', () => {
  const onValueChange = vi.fn()
  const markup = renderToString(
    <NavigationMenu.Root defaultValue="components" openDelay={0} closeDelay={0} onValueChange={onValueChange}>
      <NavigationMenu.Trigger value="getting-started">Getting started</NavigationMenu.Trigger>
      <NavigationMenu.Trigger value="components">Components</NavigationMenu.Trigger>
      <NavigationMenu.Context>{api => <output>{api.value}</output>}</NavigationMenu.Context>
    </NavigationMenu.Root>,
  )
  expect(markup).toMatch(/data-value="components"[^>]*aria-expanded="true"/)
  expect(markup).toMatch(/data-value="getting-started"[^>]*aria-expanded="false"/)
  expect(markup).toContain('<output>components</output>')
  expect(onValueChange).not.toHaveBeenCalled()
})

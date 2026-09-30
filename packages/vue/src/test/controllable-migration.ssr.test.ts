import { describe, expect, it } from 'vitest'
import { createSSRApp, defineComponent, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { Calendar, useCalendar } from '../components/calendar'
import { Collapsible, useCollapsible } from '../components/collapsible'
import { ColorPicker, useColorPicker } from '../components/color-picker'
import { Combobox, createListCollection, useCombobox } from '../components/combobox'
import { Dialog, useDialog } from '../components/dialog'
import { Edit, useEdit } from '../components/edit'
import { FloatingPanel, useFloatingPanel } from '../components/floating-panel'
import { HoverCard, useHoverCard } from '../components/hover-card'
import { Menu, useMenu } from '../components/menu'
import { Pagination, usePagination } from '../components/pagination'
import { Popover, usePopover } from '../components/popover'
import { Select, useSelect } from '../components/select'
import { Tooltip, useTooltip } from '../components/tooltip'

const collection = createListCollection({ items: ['one', 'two'] })
const entries = ['Root', 'hook', 'RootProvider'] as const

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

async function renderApi(namespace: any, hook: any, entry: typeof entries[number], props: any, field: string) {
  let value: unknown
  const renderValue = (api: any) => {
    value = api[field]
    return [
      field === 'open' ? h('button', api.getTriggerProps(), 'Trigger') : null,
      h('output', { 'data-value': String(value) }, String(value)),
    ]
  }
  const component = defineComponent({
    setup() {
      if (entry === 'Root')
        return () => h(namespace.Root, props, { default: () => h(namespace.Context, {}, { default: renderValue }) })
      const result = hook(props)
      const api = result.api ?? result
      if (entry === 'hook')
        return () => renderValue(api.value)
      return () => h(namespace.RootProvider, { value: result.api ? result : api.value }, {
        default: () => h(namespace.Context, {}, { default: renderValue }),
      })
    },
  })
  const html = await renderToString(createSSRApp(component))
  return { value, html }
}

describe('controllable initialization in actual Node SSR', () => {
  for (const [name, namespace, hook, required] of openComponents) {
    for (const entry of entries) {
      it.each([false, true])(`${name} ${entry} respects live open=%s before mount`, async (open) => {
        expect(typeof document).toBe('undefined')
        const result = await renderApi(namespace, hook, entry, { ...required, open, defaultOpen: !open }, 'open')
        expect(result.value).toBe(open)
        expect(result.html).toContain(`data-value="${open}"`)
        expect(result.html).toContain(`data-state="${open ? 'open' : 'closed'}"`)
      })
    }
  }
  for (const entry of entries) {
    it(`Calendar ${entry} renders its initial-only view on the server`, async () => {
      const result = await renderApi(Calendar, useCalendar, entry, { defaultView: 'year' }, 'view')
      expect(result.value).toBe('year')
      expect(result.html).toContain('data-value="year"')
    })
    it(`Calendar ${entry} respects live view precedence on the server`, async () => {
      expect((await renderApi(Calendar, useCalendar, entry, { view: 'month', defaultView: 'year' }, 'view')).value).toBe('month')
    })
    it(`Edit ${entry} renders its initial edit state on the server`, async () => {
      const result = await renderApi(Edit, useEdit, entry, { defaultEdit: true }, 'editing')
      expect(result.value).toBe(true)
      expect(result.html).toContain('data-value="true"')
    })
    it.each([false, true])(`Edit ${entry} respects live edit=%s on the server`, async (edit) => {
      expect((await renderApi(Edit, useEdit, entry, { edit, defaultEdit: !edit }, 'editing')).value).toBe(edit)
    })
  }
  it('combobox Root consumes its input seed on the server', async () => {
    const result = await renderApi(Combobox, useCombobox, 'Root', { collection, defaultInputValue: 'needle' }, 'inputValue')
    expect(result.value).toBe('needle')
    expect(result.html).not.toContain('defaultinputvalue')
  })
  it('pagination Root consumes its page-size seed on the server', async () => {
    const result = await renderApi(Pagination, usePagination, 'Root', { count: 100, defaultPageSize: 25 }, 'pageSize')
    expect(result.value).toBe(25)
    expect(result.html).not.toContain('defaultpagesize')
  })
})

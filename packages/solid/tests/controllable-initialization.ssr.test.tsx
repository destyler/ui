import { renderToString } from 'solid-js/web'
import { describe, expect, it } from 'vitest'
import { Calendar, useCalendar } from '../src/components/calendar'
import { Collapsible, useCollapsible } from '../src/components/collapsible'
import { ColorPicker, useColorPicker } from '../src/components/color-picker'
import { Combobox, useCombobox } from '../src/components/combobox'
import { Dialog, useDialog } from '../src/components/dialog'
import { Edit, useEdit } from '../src/components/edit'
import { FloatingPanel, useFloatingPanel } from '../src/components/floating-panel'
import { HoverCard, useHoverCard } from '../src/components/hover-card'
import { Menu, useMenu } from '../src/components/menu'
import { Popover, usePopover } from '../src/components/popover'
import { Select, useSelect } from '../src/components/select'
import { Tooltip, useTooltip } from '../src/components/tooltip'
import { createListCollection } from '../src/utils/collection'

const collection = createListCollection({ items: ['one', 'two'] })

describe('controlled initialization', () => {
  it.each([false, true])('calendar Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Calendar.Root open={open} defaultOpen={!open}>
        <Calendar.Context>{api => <output data-open={String(api().open)} />}</Calendar.Context>
      </Calendar.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('calendar public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useCalendar({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('collapsible Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Collapsible.Root open={open} defaultOpen={!open}>
        <Collapsible.Context>{api => <output data-open={String(api().open)} />}</Collapsible.Context>
      </Collapsible.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('collapsible public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useCollapsible({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('color-picker Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <ColorPicker.Root open={open} defaultOpen={!open}>
        <ColorPicker.Context>{api => <output data-open={String(api().open)} />}</ColorPicker.Context>
      </ColorPicker.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('color-picker public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useColorPicker({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('combobox Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Combobox.Root open={open} defaultOpen={!open} collection={collection}>
        <Combobox.Context>{api => <output data-open={String(api().open)} />}</Combobox.Context>
      </Combobox.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('combobox public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useCombobox({ collection, open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('dialog Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Dialog.Root open={open} defaultOpen={!open}>
        <Dialog.Context>{api => <output data-open={String(api().open)} />}</Dialog.Context>
      </Dialog.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('dialog public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useDialog({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('floating-panel Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <FloatingPanel.Root open={open} defaultOpen={!open}>
        <FloatingPanel.Context>{api => <output data-open={String(api().open)} />}</FloatingPanel.Context>
      </FloatingPanel.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('floating-panel public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useFloatingPanel({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('hover-card Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <HoverCard.Root open={open} defaultOpen={!open}>
        <HoverCard.Context>{api => <output data-open={String(api().open)} />}</HoverCard.Context>
      </HoverCard.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('hover-card public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useHoverCard({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('menu Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Menu.Root open={open} defaultOpen={!open}>
        <Menu.Context>{api => <output data-open={String(api().open)} />}</Menu.Context>
      </Menu.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('menu public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const { api } = useMenu({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('popover Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Popover.Root open={open} defaultOpen={!open}>
        <Popover.Context>{api => <output data-open={String(api().open)} />}</Popover.Context>
      </Popover.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('popover public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = usePopover({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('select Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Select.Root open={open} defaultOpen={!open} collection={collection}>
        <Select.Context>{api => <output data-open={String(api().open)} />}</Select.Context>
      </Select.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('select public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useSelect({ collection, open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('tooltip Root gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => (
      <Tooltip.Root open={open} defaultOpen={!open}>
        <Tooltip.Context>{api => <output data-open={String(api().open)} />}</Tooltip.Context>
      </Tooltip.Root>
    ))
    expect(html).toContain(`data-open="${open}"`)
  })

  it.each([false, true])('tooltip public hook gives live open %s precedence over its default', (open) => {
    const html = renderToString(() => {
      const api = useTooltip({ open, defaultOpen: !open })
      return <output data-open={String(api().open)} />
    })
    expect(html).toContain(`data-open="${open}"`)
  })

  it('calendar Root honors defaultView on the server', () => {
    const html = renderToString(() => (
      <Calendar.Root defaultView="year">
        <Calendar.Context>{api => <output data-view={api().view} />}</Calendar.Context>
      </Calendar.Root>
    ))
    expect(html).toContain('data-view="year"')
  })

  it('calendar hook gives explicit view precedence', () => {
    const html = renderToString(() => {
      const api = useCalendar({ view: 'month', defaultView: 'year' })
      return <output data-view={api().view} />
    })
    expect(html).toContain('data-view="month"')
  })

  it('edit Root honors defaultEdit on the server', () => {
    const html = renderToString(() => (
      <Edit.Root defaultEdit>
        <Edit.Context>{api => <output data-editing={String(api().editing)} />}</Edit.Context>
      </Edit.Root>
    ))
    expect(html).toContain('data-editing="true"')
  })

  it('edit hook gives explicit false precedence over defaultEdit', () => {
    const html = renderToString(() => {
      const api = useEdit({ edit: false, defaultEdit: true })
      return <output data-editing={String(api().editing)} />
    })
    expect(html).toContain('data-editing="false"')
  })
})

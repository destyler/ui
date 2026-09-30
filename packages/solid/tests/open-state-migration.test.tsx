import type { Accessor } from 'solid-js'
import { cleanup, render, waitFor } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Calendar } from '../src/components/calendar'
import { Collapsible } from '../src/components/collapsible'
import { ColorPicker } from '../src/components/color-picker'
import { Combobox } from '../src/components/combobox'
import { Dialog } from '../src/components/dialog'
import { FloatingPanel } from '../src/components/floating-panel'
import { HoverCard } from '../src/components/hover-card'
import { Menu } from '../src/components/menu'
import { Popover } from '../src/components/popover'
import { Select } from '../src/components/select'
import { Tooltip } from '../src/components/tooltip'
import { createListCollection } from '../src/utils/collection'

const collection = createListCollection({ items: ['one', 'two'] })
type OpenApi = Accessor<{ open: boolean, setOpen: (open: boolean) => void }>
afterEach(cleanup)

describe('open ownership through every Root', () => {
  it.each([false, true])('calendar updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Calendar.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <Calendar.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Calendar.Context>
        <Calendar.Trigger data-testid="trigger">Trigger</Calendar.Trigger>
        <Calendar.Input />
        <Calendar.Positioner><Calendar.Content>Content</Calendar.Content></Calendar.Positioner>
      </Calendar.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('collapsible updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Collapsible.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <Collapsible.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Collapsible.Context>
        <Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>

        <Collapsible.Content>Content</Collapsible.Content>
      </Collapsible.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('color-picker updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <ColorPicker.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <ColorPicker.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </ColorPicker.Context>
        <ColorPicker.Trigger data-testid="trigger">Trigger</ColorPicker.Trigger>

        <ColorPicker.Positioner><ColorPicker.Content>Content</ColorPicker.Content></ColorPicker.Positioner>
      </ColorPicker.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('combobox updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Combobox.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange} collection={collection}>
        <Combobox.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Combobox.Context>
        <Combobox.Trigger data-testid="trigger">Trigger</Combobox.Trigger>
        <Combobox.Input />
        <Combobox.Positioner><Combobox.Content>Content</Combobox.Content></Combobox.Positioner>
      </Combobox.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('dialog updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Dialog.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange} modal={false} trapFocus={false} preventScroll={false}>
        <Dialog.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Dialog.Context>
        <Dialog.Trigger data-testid="trigger">Trigger</Dialog.Trigger>

        <Dialog.Content>Content</Dialog.Content>
      </Dialog.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('floating-panel updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <FloatingPanel.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <FloatingPanel.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </FloatingPanel.Context>
        <FloatingPanel.Trigger data-testid="trigger">Trigger</FloatingPanel.Trigger>

        <FloatingPanel.Positioner><FloatingPanel.Content>Content</FloatingPanel.Content></FloatingPanel.Positioner>
      </FloatingPanel.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('hover-card updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <HoverCard.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <HoverCard.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </HoverCard.Context>
        <HoverCard.Trigger data-testid="trigger">Trigger</HoverCard.Trigger>

        <HoverCard.Positioner><HoverCard.Content>Content</HoverCard.Content></HoverCard.Positioner>
      </HoverCard.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('menu updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Menu.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <Menu.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Menu.Context>
        <Menu.Trigger data-testid="trigger">Trigger</Menu.Trigger>

        <Menu.Positioner><Menu.Content>Content</Menu.Content></Menu.Positioner>
      </Menu.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('popover updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Popover.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <Popover.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Popover.Context>
        <Popover.Trigger data-testid="trigger">Trigger</Popover.Trigger>

        <Popover.Positioner><Popover.Content>Content</Popover.Content></Popover.Positioner>
      </Popover.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('select updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Select.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange} collection={collection}>
        <Select.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Select.Context>
        <Select.Trigger data-testid="trigger">Trigger</Select.Trigger>

        <Select.Positioner><Select.Content>Content</Select.Content></Select.Positioner>
      </Select.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })

  it.each([false, true])('tooltip updates API and trigger state with controlled=%s', async (controlled) => {
    let api!: OpenApi
    const [open, setOpen] = createSignal(false)
    const onOpenChange = vi.fn()
    const view = render(() => (
      <Tooltip.Root open={controlled ? open() : undefined} defaultOpen={controlled} onOpenChange={onOpenChange}>
        <Tooltip.Context>{(context) => {
          api = context
          return <output data-testid="api">{String(context().open)}</output>
        }}
        </Tooltip.Context>
        <Tooltip.Trigger data-testid="trigger">Trigger</Tooltip.Trigger>

        <Tooltip.Positioner><Tooltip.Content>Content</Tooltip.Content></Tooltip.Positioner>
      </Tooltip.Root>
    ))
    expect(api().open).toBe(false)
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    api().setOpen(true)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    if (controlled) {
      expect(api().open).toBe(false)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
      setOpen(true)
    }
    await waitFor(() => expect(api().open).toBe(true))
    expect(view.getByTestId('api')).toHaveTextContent('true')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: true })))
    api().setOpen(false)
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
    if (controlled) {
      expect(api().open).toBe(true)
      expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'open')
      setOpen(false)
    }
    await waitFor(() => expect(api().open).toBe(false))
    expect(view.getByTestId('api')).toHaveTextContent('false')
    expect(view.getByTestId('trigger')).toHaveAttribute('data-state', 'closed')
    await waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(expect.objectContaining({ open: false })))
  })
})

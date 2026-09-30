import type { Component } from 'svelte'
import {
  Calendar,
  Collapsible,
  ColorPicker,
  Combobox,
  Dialog,
  FloatingPanel,
  HoverCard,
  Menu,
  Popover,
  Select,
  Tooltip,
  useCalendar,
  useCollapsible,
  useColorPicker,
  useCombobox,
  useDialog,
  useFloatingPanel,
  useHoverCard,
  useMenu,
  usePopover,
  useSelect,
  useTooltip,
} from '$lib'

export const openFamilies = [
  'calendar',
  'collapsible',
  'color-picker',
  'combobox',
  'dialog',
  'floating-panel',
  'hover-card',
  'menu',
  'popover',
  'select',
  'tooltip',
] as const
export type OpenFamily = typeof openFamilies[number]
export type Entry = 'root' | 'hook' | 'provider'
export const entries: Entry[] = ['root', 'hook', 'provider']

export interface OpenApi {
  open: boolean
  setOpen: (open: boolean) => void
  getTriggerProps: () => Record<string, unknown>
  getContentProps: () => Record<string, unknown>
  getPositionerProps?: () => Record<string, unknown>
  getInputProps?: () => Record<string, unknown>
  getLabelProps?: () => Record<string, unknown>
  getControlProps?: () => Record<string, unknown>
  getListProps?: () => Record<string, unknown>
  getItemProps?: (props: { item: unknown }) => Record<string, unknown>
}

interface OpenCase {
  // A shared fixture exercises the same contract across differently typed roots.
  components: {
    Root: Component<any>
    RootProvider: Component<any>
    Context: Component<any>
  }
  use: (props: () => any) => () => any
}

export const openCases: Record<OpenFamily, OpenCase> = {
  'calendar': { components: Calendar, use: useCalendar },
  'collapsible': { components: Collapsible, use: useCollapsible },
  'color-picker': { components: ColorPicker, use: useColorPicker },
  'combobox': { components: Combobox, use: useCombobox },
  'dialog': { components: Dialog, use: useDialog },
  'floating-panel': { components: FloatingPanel, use: useFloatingPanel },
  'hover-card': { components: HoverCard, use: useHoverCard },
  'menu': { components: Menu, use: useMenu },
  'popover': { components: Popover, use: usePopover },
  'select': { components: Select, use: useSelect },
  'tooltip': { components: Tooltip, use: useTooltip },
}

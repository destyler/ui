/// <reference types="vite/client" />
import type { Context as ColorpickerContext } from '@destyler/color-picker'
import type { Context as ComboboxContext } from '@destyler/combobox'
import type { Context as NumberinputContext } from '@destyler/number-input'
import type { Context as OtpinputContext } from '@destyler/otp-input'
import { props as calendarProps } from '@destyler/calendar'
import { props as carouselProps } from '@destyler/carousel'
import { props as checkboxProps } from '@destyler/checkbox'
import { props as collapseProps } from '@destyler/collapse'
import { props as collapsibleProps } from '@destyler/collapsible'
import { props as dialogProps } from '@destyler/dialog'
import { props as editProps } from '@destyler/edit'
import { props as floatingpanelProps } from '@destyler/floating-panel'
import { props as hovercardProps } from '@destyler/hover-card'
import { props as menuProps } from '@destyler/menu'
import { props as navigationmenuProps } from '@destyler/navigation-menu'
import { props as paginationProps } from '@destyler/pagination'
import { props as popoverProps } from '@destyler/popover'
import { props as radioProps } from '@destyler/radio'
import { props as selectProps } from '@destyler/select'
import { props as sliderProps } from '@destyler/slider'
import { props as splitterProps } from '@destyler/splitter'
import { props as stepsProps } from '@destyler/steps'
import { props as switchProps } from '@destyler/switch'
import { props as tabsProps } from '@destyler/tabs'
import { props as toggleProps } from '@destyler/toggle'
import { props as tooltipProps } from '@destyler/tooltip'
import { props as treeProps } from '@destyler/tree'
import { describe, expect, it } from 'vitest'

const roots = import.meta.glob<{ default: { props: Record<string, unknown> } }>('../components/*/components/Root.vue', { eager: true })
// These core packages do not export a runtime props list. Require an exhaustive
// record of their typed default keys so additions fail the TypeScript contract.
type Defaults<T> = { [K in Extract<keyof T, `default${string}`>]-?: true }
const colorpickerDefaults = { defaultOpen: true, defaultValue: true } satisfies Defaults<ColorpickerContext>
const comboboxDefaults = { defaultOpen: true, defaultValue: true, defaultInputValue: true } satisfies Defaults<ComboboxContext>
const numberinputDefaults = { defaultValue: true } satisfies Defaults<NumberinputContext>
const otpinputDefaults = { defaultValue: true } satisfies Defaults<OtpinputContext>

const contracts = [
  ['calendar', calendarProps],
  ['carousel', carouselProps],
  ['checkbox', checkboxProps],
  ['collapse', collapseProps],
  ['collapsible', collapsibleProps],
  ['color-picker', Object.keys(colorpickerDefaults)],
  ['combobox', Object.keys(comboboxDefaults)],
  ['dialog', dialogProps],
  ['edit', editProps],
  ['floating-panel', floatingpanelProps],
  ['hover-card', hovercardProps],
  ['menu', menuProps],
  ['navigation-menu', navigationmenuProps],
  ['number-input', Object.keys(numberinputDefaults)],
  ['otp-input', Object.keys(otpinputDefaults)],
  ['pagination', paginationProps],
  ['popover', popoverProps],
  ['radio', radioProps],
  ['select', selectProps],
  ['slider', sliderProps],
  ['splitter', splitterProps],
  ['steps', stepsProps],
  ['switch', switchProps],
  ['tabs', tabsProps],
  ['toggle-group', toggleProps],
  ['tooltip', tooltipProps],
  ['tree', treeProps],
] as const

describe('vue Root runtime defaults stay aligned with core', () => {
  for (const [name, props] of contracts) {
    it(`${name} declares every core default prop`, () => {
      const root = roots[`../components/${name}/components/Root.vue`].default
      const defaults = props.filter(prop => prop.startsWith('default'))
      expect(defaults.length).toBeGreaterThan(0)
      for (const prop of defaults)
        expect(root.props, `${name}.Root must consume ${prop}, not forward it as an attribute`).toHaveProperty(prop)
    })
  }
})

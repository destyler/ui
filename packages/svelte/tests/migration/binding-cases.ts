import type { Component } from 'svelte'
import {
  Calendar,
  Carousel,
  Checkbox,
  Collapse,
  ColorPicker,
  Combobox,
  createListCollection,
  createTreeCollection,
  Dynamic,
  Edit,
  NavigationMenu,
  NumberInput,
  OtpInput,
  Pagination,
  parseColor,
  parseDate,
  Progress,
  QrCode,
  Radio,
  Select,
  Slider,
  Splitter,
  Steps,
  Switch,
  Tabs,
  Toggle,
  ToggleGroup,
  Tree,
} from '$lib'
import { openCases, openFamilies } from './open-cases'

// These fixtures deliberately share one contract across differently typed APIs.
export type BindingApi = Record<string, any>
export type BindingState = 'checked' | 'pressed' | 'open' | 'value' | 'inputValue' | 'page' | 'pageSize' | 'size' | 'step' | 'edit' | 'focusedValue' | 'expandedValue' | 'selectedValue' | 'view'
export type BindingMode = 'controlled' | 'bound' | 'bound-undefined' | 'bound-veto' | 'uncontrolled'

export interface BindingCase {
  name: string
  family: string
  components: { Root: Component<any>, Context: Component<any> }
  state: BindingState
  initial: () => any
  next: () => any
  props?: () => Record<string, unknown>
  read?: (api: BindingApi) => any
  request?: (api: BindingApi, value: any) => void
  // These core APIs intentionally allow mutable requests with an ordinary value prop.
  controlledVeto?: boolean
  coalescesPendingRequest?: boolean
  requiresLayout?: boolean
  hasDefault?: boolean
  uncontrolledInitial?: () => any
  callback?: string
  detail?: (details: any) => any
  format?: (value: any) => string
}

const listProps = () => ({ collection: createListCollection({ items: ['one', 'two'] }) })
function treeProps() {
  return {
    collection: createTreeCollection({
      nodeToValue: (node: { id: string }) => node.id,
      nodeToString: (node: { id: string }) => node.id,
      rootNode: { id: 'ROOT', children: [{ id: 'one', children: [{ id: 'child' }] }, { id: 'two' }] },
    }),
  }
}
const arrayInitial = () => ['one']
const arrayNext = () => ['two']
const dateFormat = (value: any) => value === undefined ? 'undefined' : String(value)
const colorFormat = (value: any) => value === undefined ? 'undefined' : value.toString('hex')
const datesFormat = (value: any) => value === undefined ? 'undefined' : JSON.stringify(value.map(String))

export const valueBindingCases: BindingCase[] = [
  { name: 'Checkbox.checked', family: 'checkbox', components: Checkbox, state: 'checked', initial: () => false, next: () => true },
  { name: 'Switch.checked', family: 'switch', components: Switch, state: 'checked', initial: () => false, next: () => true },
  { name: 'Toggle.pressed', family: 'toggle', components: Toggle, state: 'pressed', initial: () => false, next: () => true, detail: value => value },
  { name: 'Calendar.value', family: 'calendar', components: Calendar, state: 'value', initial: () => [parseDate('2025-01-01')], next: () => [parseDate('2025-02-02')], format: datesFormat },
  { name: 'Calendar.focusedValue', hasDefault: false, controlledVeto: false, family: 'calendar', components: Calendar, state: 'focusedValue', initial: () => parseDate('2025-01-01'), next: () => parseDate('2025-02-02'), callback: 'onFocusChange', format: dateFormat },
  { name: 'Calendar.view', controlledVeto: false, family: 'calendar', components: Calendar, state: 'view', initial: () => 'day', next: () => 'month' },
  { name: 'Carousel.page', family: 'carousel', components: Carousel, state: 'page', initial: () => 0, next: () => 1, props: () => ({ slideCount: 3, slidesPerPage: 1, slidesPerMove: 1 }), request: (api, value) => api.scrollTo(value, true), requiresLayout: true },
  { name: 'Collapse.value', family: 'collapse', components: Collapse, state: 'value', initial: arrayInitial, next: arrayNext },
  { name: 'ColorPicker.value', family: 'color-picker', components: ColorPicker, state: 'value', initial: () => parseColor('#ff0000'), next: () => parseColor('#0000ff'), format: colorFormat },
  { name: 'Combobox.value', family: 'combobox', components: Combobox, state: 'value', initial: arrayInitial, next: arrayNext, props: listProps },
  { name: 'Combobox.inputValue', family: 'combobox', components: Combobox, state: 'inputValue', initial: () => 'one', next: () => 'two', props: listProps },
  { name: 'Dynamic.value', controlledVeto: false, family: 'dynamic', components: Dynamic, state: 'value', initial: arrayInitial, next: arrayNext },
  { name: 'Dynamic.inputValue', hasDefault: false, uncontrolledInitial: () => '', controlledVeto: false, family: 'dynamic', components: Dynamic, state: 'inputValue', initial: () => 'one', next: () => 'two' },
  { name: 'Edit.value', family: 'edit', components: Edit, state: 'value', initial: () => 'one', next: () => 'two' },
  { name: 'Edit.edit', family: 'edit', components: Edit, state: 'edit', initial: () => false, next: () => true, read: api => api.editing, request: (api, value) => value ? api.edit() : api.submit() },
  { name: 'NavigationMenu.value', family: 'navigation-menu', components: NavigationMenu, state: 'value', initial: () => null, next: () => 'one', props: () => ({ disableHoverTrigger: true, openDelay: 0, closeDelay: 0 }) },
  { name: 'NumberInput.value', family: 'number-input', components: NumberInput, state: 'value', initial: () => '1', next: () => '2' },
  { name: 'OtpInput.value', family: 'otp-input', components: OtpInput, state: 'value', initial: () => ['1', '2'], next: () => ['3', '4'] },
  { name: 'Pagination.page', family: 'pagination', components: Pagination, state: 'page', initial: () => 1, next: () => 2, props: () => ({ count: 100 }) },
  { name: 'Pagination.pageSize', family: 'pagination', components: Pagination, state: 'pageSize', initial: () => 10, next: () => 20, props: () => ({ count: 100 }) },
  { name: 'Progress.value', controlledVeto: false, family: 'progress', components: Progress, state: 'value', initial: () => 10, next: () => 20 },
  { name: 'QrCode.value', controlledVeto: false, family: 'qr-code', components: QrCode, state: 'value', initial: () => 'one', next: () => 'two' },
  { name: 'Radio.value', family: 'radio', components: Radio, state: 'value', initial: () => 'one', next: () => 'two' },
  { name: 'Select.value', family: 'select', components: Select, state: 'value', initial: arrayInitial, next: arrayNext, props: listProps },
  { name: 'Slider.value', family: 'slider', components: Slider, state: 'value', initial: () => [10], next: () => [20] },
  {
    name: 'Splitter.size',
    family: 'splitter',
    components: Splitter,
    state: 'size',
    initial: () => [{ id: 'a', size: 50 }, { id: 'b', size: 50 }],
    next: () => [{ id: 'a', size: 30 }, { id: 'b', size: 50 }],
    read: api => ['a', 'b'].map(id => ({ id, size: Number.parseFloat(/flex-grow:([^;]+)/.exec(api.getPanelProps({ id }).style)?.[1] ?? '') })),
    request: (api, value) => api.setSize('a', value[0].size),
  },
  { name: 'Steps.step', family: 'steps', components: Steps, state: 'step', read: api => api.value, initial: () => 0, next: () => 1, props: () => ({ count: 3 }) },
  { name: 'Tabs.value', family: 'tabs', components: Tabs, state: 'value', initial: () => 'one', next: () => 'two' },
  { name: 'ToggleGroup.value', request: (api, value) => api.setValue(value[0]), family: 'toggle-group', components: ToggleGroup, state: 'value', initial: arrayInitial, next: arrayNext },
  { name: 'Tree.expandedValue', callback: 'onExpandedChange', family: 'tree', components: Tree, state: 'expandedValue', initial: () => [], next: arrayInitial, props: treeProps },
  { name: 'Tree.selectedValue', callback: 'onSelectionChange', family: 'tree', components: Tree, state: 'selectedValue', initial: arrayInitial, next: arrayNext, props: treeProps },
]

export const openBindingCases: BindingCase[] = openFamilies.map(family => ({
  name: `${family}.open`,
  family,
  components: openCases[family].components,
  state: 'open',
  coalescesPendingRequest: family === 'hover-card',
  initial: () => false,
  next: () => true,
  props: () => ({
    ...(family === 'select' || family === 'combobox' ? listProps() : {}),
    ...(family === 'dialog' || family === 'popover' ? { modal: false, preventScroll: false } : {}),
    ...(family === 'hover-card' || family === 'tooltip' ? { openDelay: 0, closeDelay: 0 } : {}),
    closeOnInteractOutside: false,
    onInteractOutside: (event: Event) => event.preventDefault(),
  }),
}))

export const bindingCases = [...valueBindingCases, ...openBindingCases]

export function formatState(testCase: BindingCase, value: any): string {
  return testCase.format?.(value) ?? (value === undefined ? 'undefined' : JSON.stringify(value))
}

export function readState(testCase: BindingCase, api: BindingApi): any {
  return testCase.read?.(api) ?? api[testCase.state]
}

export function requestState(testCase: BindingCase, api: BindingApi, value: any): void {
  if (testCase.request)
    testCase.request(api, value)
  else
    api[`set${testCase.state[0].toUpperCase()}${testCase.state.slice(1)}`](value)
}

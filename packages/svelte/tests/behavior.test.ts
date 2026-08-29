import { expect, it } from 'vitest'
import { render } from 'vitest-browser-svelte'
import BreadcrumbsFixture from './breadcrumbs.fixture.svelte'
import CheckboxFixture from './checkbox.fixture.svelte'
import ContextContractFixture from './context-contract.fixture.svelte'
import DefaultValuesFixture from './default-values.fixture.svelte'
import FieldDescriptionsFixture from './field-descriptions.fixture.svelte'
import GeneratedIdsFixture from './generated-ids.fixture.svelte'
import MachineAdapterFixture from './machine-adapter.fixture.svelte'
import PortalActionFixture from './portal-action.fixture.svelte'
import PresencePriorityFixture from './presence-priority.fixture.svelte'
import ToggleFixture from './toggle.fixture.svelte'

it('checkbox updates its bindable checked state', async () => {
  const screen = await render(CheckboxFixture)
  const checkbox = screen.getByRole('checkbox')

  await expect.element(checkbox).not.toBeChecked()
  await screen.getByText('Accept terms').click()
  await expect.element(checkbox).toBeChecked()
  await expect.element(screen.getByText('checked', { exact: true })).toBeVisible()
})

it('toggle exposes pressed state and updates its binding', async () => {
  const screen = await render(ToggleFixture)
  const toggle = screen.getByRole('button', { name: 'Bold' })

  await expect.element(toggle).toHaveAttribute('aria-pressed', 'false')
  await toggle.click()
  await expect.element(toggle).toHaveAttribute('aria-pressed', 'true')
  await expect.element(screen.getByText('pressed', { exact: true })).toBeVisible()
})

it('breadcrumbs pass each item to the core getters', async () => {
  const screen = await render(BreadcrumbsFixture)
  const items = screen.container.querySelectorAll('[data-scope="breadcrumbs"][data-part="item"]')

  expect(items).toHaveLength(2)
  expect(items[1]?.getAttribute('aria-label')).toBe('breadcrumbs:listitem:Docs')
  await expect.element(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
  await expect.element(screen.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-current', 'page')
})

it('default state props initialize machines and scroll position', async () => {
  const screen = await render(DefaultValuesFixture)

  await expect.element(screen.getByRole('checkbox', { name: 'Initially checked' })).toBeChecked()
  await expect.element(screen.getByText('Initially open')).toBeVisible()
  await screen.getByRole('button', { name: 'Details' }).click()
  await expect.element(screen.getByText('Initially open')).not.toBeVisible()
  await screen.getByRole('button', { name: 'Details' }).click()
  await expect.element(screen.getByText('Initially open')).toBeVisible()
  await expect.element(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '42')
  await expect.element(screen.getByRole('tab', { name: 'First' })).toHaveAttribute('aria-selected', 'false')
  await expect.element(screen.getByRole('tab', { name: 'First' })).not.toBeDisabled()
  await expect.element(screen.getByRole('tab', { name: 'Second' })).toHaveAttribute('aria-selected', 'true')

  const viewport = screen.container.querySelector('[data-testid="viewport"]') as HTMLElement
  expect(viewport.scrollTop).toBe(40)
  expect(viewport.scrollLeft).toBe(25)
})

it('root components generate stable unique ids when id is omitted', async () => {
  const screen = await render(GeneratedIdsFixture)
  const contracts = [
    'aspect-ratio',
    'avatar',
    'breadcrumbs',
    'calendar',
    'carousel',
    'checkbox',
    'clipboard',
    'collapse',
    'collapsible',
    'color-picker',
    'combobox',
    'dialog',
    'dynamic',
    'edit',
    'field',
    'fieldset',
    'file-upload',
    'floating-panel',
    'hover-card',
    'label',
    'menu',
    'navigation-menu',
    'number-input',
    'otp-input',
    'pagination',
    'popover',
    'progress',
    'qr-code',
    'radio',
    'scroll-area',
    'select',
    'separator',
    'signature',
    'slider',
    'splitter',
    'steps',
    'switch',
    'tabs',
    'timer',
    'toggle-group',
    'tooltip',
    'tour',
    'tree',
  ]

  for (const contract of contracts) {
    const selector = `[data-id-contract="${contract}"][data-instance]`
    const ids = Array.from(
      screen.container.querySelectorAll<HTMLElement>(selector),
      element => element.id,
    )
    expect(ids, contract).toHaveLength(2)
    expect(ids.every(Boolean), contract).toBe(true)
    expect(ids.some(id => id.includes('undefined')), contract).toBe(false)
    expect(new Set(ids).size, contract).toBe(2)
  }

  const explicitIds = {
    'explicit-number-input': 'number-input:provided-number-input',
    'explicit-tree': 'tree:provided-tree:root',
    'explicit-dynamic': 'dynamic:provided-dynamic',
    'explicit-field': 'field::provided-field',
    'explicit-fieldset': 'fieldset::provided-fieldset::helper-text',
    'explicit-splitter': 'splitter:provided-splitter',
  }

  for (const [testId, id] of Object.entries(explicitIds))
    await expect.element(screen.getByTestId(testId)).toHaveAttribute('id', id)
})

it('portal moves content to the document body', async () => {
  const screen = await render(PortalActionFixture)
  const portalled = document.body.querySelector('[data-testid="portalled"]')

  expect(screen.container.querySelector('[data-testid="portalled"]')).toBeNull()
  expect(portalled?.textContent).toBe('Portalled content')
})

it('composed roots give an explicit presence value precedence over machine state', async () => {
  const screen = await render(PresencePriorityFixture)

  await expect.element(screen.getByTestId('root-presence-override')).toHaveAttribute('hidden')
  await expect.element(screen.getByTestId('root-provider-presence-override')).toHaveAttribute('hidden')
  await expect.element(screen.getByTestId('root-presence-force-open')).not.toHaveAttribute('hidden')
})

it('machine adapter preserves class identity and installs actions before start', async () => {
  const screen = await render(MachineAdapterFixture)

  await expect.element(screen.getByTestId('class-identity')).toHaveTextContent('preserved')
  await expect.element(screen.getByTestId('initial-action')).toHaveTextContent('ran')
  await expect.element(screen.getByTestId('machine-state')).toHaveTextContent('idle')
  await screen.getByRole('button', { name: 'Advance machine' }).click()
  await expect.element(screen.getByTestId('machine-state')).toHaveTextContent('done')
})

it('distinguishes required component contexts from optional parent contexts', async () => {
  const screen = await render(ContextContractFixture)

  await expect.element(screen.getByTestId('checkbox-context-error')).toHaveTextContent(
    'ContextError:useCheckboxContext must be used within a CheckboxProvider',
  )
  await expect.element(screen.getByTestId('channel-props-context-error')).toHaveTextContent(
    'ContextError:useColorPickerChannelPropsContext returned `undefined`',
  )
  await expect.element(screen.getByTestId('swatch-props-context-error')).toHaveTextContent(
    'ContextError:useColorPickerSwatchPropsContext returned `undefined`',
  )
  await expect.element(screen.getByTestId('optional-contexts')).toHaveTextContent('all-absent')
})

it('associates composite form controls with their field descriptions', async () => {
  const screen = await render(FieldDescriptionsFixture)
  const controls = [
    ['combobox', 'input[role="combobox"]'],
    ['dynamic', 'input[hidden]'],
    ['edit', 'input[aria-label="editable input"]'],
    ['file-upload', 'input[type="file"]'],
    ['otp-input', 'input[aria-hidden="true"]'],
    ['select', 'select[aria-hidden="true"]'],
    ['signature', 'input[hidden]'],
    ['switch', 'input[type="checkbox"]'],
  ] as const

  for (const [contract, selector] of controls) {
    const control = screen.container.querySelector(
      `[data-field-contract="${contract}"] ${selector}`,
    )
    expect(control, contract).not.toBeNull()

    const describedBy = control?.getAttribute('aria-describedby')
    expect(describedBy, contract).toBeTruthy()
    for (const id of describedBy?.split(' ') ?? [])
      expect(document.getElementById(id), `${contract}:${id}`).not.toBeNull()
  }
})

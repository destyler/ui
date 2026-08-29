import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import Basic from '../examples/Basic.svelte'
import Controlled from '../examples/Controlled.svelte'
import Group from '../examples/Group.svelte'
import GroupControlled from '../examples/GroupControlled.svelte'
import GroupWithSelectAll from '../examples/GroupWithSelectAll.svelte'
import Indeterminate from '../examples/Indeterminate.svelte'
import RenderProp from '../examples/RenderProp.svelte'
import RootProvider from '../examples/RootProvider.svelte'
import WithField from '../examples/WithField.svelte'
import { Checkbox, checkboxAnatomy } from '../index'

const componentExports = Checkbox as unknown as Record<string, unknown>

describe('[checkbox] component', () => {
  it.each(checkboxAnatomy.keys().filter(part => part !== 'group'))('renders part %s', async (part) => {
    await render(Basic)
    const dataPart = part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
    expect(document.querySelector(`[data-scope="checkbox"][data-part="${dataPart}"]`)).not.toBeNull()
  })

  it('renders the group part', async () => {
    await render(Group)
    expect(document.querySelector('[data-scope="checkbox"][data-part="group"]')).not.toBeNull()
    expect(document.querySelectorAll('[data-part="indicator"] svg')).toHaveLength(3)
  })

  it('keeps the controlled group in the shared layout wrapper', async () => {
    const screen = await render(GroupControlled)
    expect(screen.container.firstElementChild?.tagName).toBe('DIV')
    expect(screen.container.querySelectorAll('[data-part="indicator"] svg')).toHaveLength(3)
  })

  it.each(checkboxAnatomy.keys())('exports %s', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Checkbox.${exportName}`).toBeDefined()
  })

  it('checks and unchecks from its label', async () => {
    const onCheckedChange = vi.fn()
    const screen = await render(Basic, { props: { onCheckedChange } })
    const input = screen.getByRole('checkbox')
    await screen.getByText('Checkbox').click()
    await expect.element(input).toBeChecked()
    expect(onCheckedChange).toHaveBeenCalled()
    await screen.getByText('Checkbox').click()
    await expect.element(input).not.toBeChecked()
  })

  it('supports controlled and indeterminate state', async () => {
    const controlled = await render(Controlled)
    await expect.element(controlled.getByRole('checkbox')).toBeChecked()
  })

  it('renders indeterminate state', async () => {
    const screen = await render(Indeterminate)
    await expect.element(screen.getByTestId('control')).toHaveAttribute('data-state', 'indeterminate')
  })

  it('updates group selection and select-all state', async () => {
    const group = await render(Group)
    const inputs = group.getByRole('checkbox')
    await expect.element(inputs.first()).toBeChecked()
    await group.getByText('Vue').click()
    await expect.element(inputs.last()).toBeChecked()
  })

  it('selects every item with Select All', async () => {
    const screen = await render(GroupWithSelectAll)
    const wrapper = screen.container.firstElementChild as HTMLElement
    expect(wrapper.style.display).toBe('flex')
    expect(wrapper.style.flexDirection).toBe('column')
    expect(wrapper.style.gap).toBe('10px')
    expect(wrapper.querySelectorAll('[data-part="indicator"] svg')).toHaveLength(5)
    await screen.getByText('Select All').click()
    for (const input of document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'))
      await expect.element(input).toBeChecked()
  })

  it('updates Context and RootProvider APIs', async () => {
    const context = await render(RenderProp)
    await expect.element(context.getByText('Checkbox false')).toBeVisible()
    await context.getByText('Checkbox false').click()
    await expect.element(context.getByText('Checkbox true')).toBeVisible()
  })

  it('toggles through RootProvider', async () => {
    const screen = await render(RootProvider)
    await screen.getByRole('button', { name: 'Toggle' }).click()
    await expect.element(screen.getByText('Checked')).toBeVisible()
  })
})

describe('[checkbox] field integration', () => {
  it('inherits required, disabled, and readonly state', async () => {
    const required = await render(WithField, { props: { required: true } })
    await expect.element(required.getByRole('checkbox', { name: /label/i })).toBeRequired()
  })

  it('disables the checkbox', async () => {
    const screen = await render(WithField, { props: { disabled: true } })
    await expect.element(screen.getByRole('checkbox', { name: /label/i })).toBeDisabled()
  })

  it('marks the label readonly', async () => {
    const screen = await render(WithField, { props: { readOnly: true } })
    await expect.element(screen.getByText('Label')).toHaveAttribute('data-readonly')
  })

  it('renders helper and conditional error text', async () => {
    const screen = await render(WithField, { props: { invalid: true } })
    await expect.element(screen.getByText('Additional Info')).toBeVisible()
    await expect.element(screen.getByText('Error Info')).toBeVisible()
  })

  it('focuses the checkbox when its label is clicked', async () => {
    const screen = await render(WithField)
    await screen.getByText('Label').click()
    await expect.element(screen.getByRole('checkbox', { name: /label/i })).toHaveFocus()
  })

  it('hides error text when valid', async () => {
    const screen = await render(WithField)
    await expect.element(screen.getByText('Error Info')).not.toBeInTheDocument()
  })
})

import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { page, userEvent } from 'vitest/browser'
import Action from '../examples/Action.svelte'
import Basic from '../examples/Basic.svelte'
import ToastAction from '../examples/ToastAction.svelte'
import ToastPlacement from '../examples/ToastPlacement.svelte'
import ToastPromise from '../examples/ToastPromise.svelte'
import ToastTypes from '../examples/ToastTypes.svelte'
import ToastUpdate from '../examples/ToastUpdate.svelte'
import Update from '../examples/Update.svelte'
import { Toast, toastAnatomy } from '../index'

const componentExports = Toast as unknown as Record<string, unknown>
const partName = (part: string) => part.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)
const testPromiseDelay = 5_000
const testToastDuration = 60_000
const promiseTestTimeout = 30_000

describe('[toast] component', () => {
  it('exports Toaster from the Toast namespace', () => {
    expect(Toast.Toaster).toBeDefined()
  })

  it.each(toastAnatomy.keys())('renders the %s anatomy part', async (part) => {
    await render(Basic, { props: { duration: testToastDuration } })
    await userEvent.click(page.getByText('Create Toast'))
    await vi.waitFor(() => {
      expect(document.querySelector(`[data-scope="toast"][data-part="${partName(part)}"]`)).toBeInTheDocument()
    })
  })

  it.each(toastAnatomy.keys().filter(part => part !== 'group'))('exports the %s anatomy part', (part) => {
    const exportName = `${part.charAt(0).toUpperCase()}${part.slice(1)}`
    expect(componentExports[exportName], `Toast.${exportName}`).toBeDefined()
  })

  it('creates and dismisses a toast', async () => {
    const screen = await render(Basic, { props: { duration: testToastDuration } })
    await userEvent.click(page.getByText('Create Toast'))
    await vi.waitFor(async () => expect.element(page.getByText('Title')).toBeVisible())
    await expect.element(page.getByText('Description')).toBeVisible()
    const group = screen.container.querySelector('[data-part="group"]') as HTMLElement
    const root = screen.container.querySelector('[data-part="root"]') as HTMLElement
    expect(group.style.getPropertyValue('--gap')).toBe('24px')
    expect(root).toHaveAttribute('data-overlap')
    await userEvent.click(page.getByText('x'))
    await vi.waitFor(async () => expect.element(page.getByText('Title')).not.toBeInTheDocument())
  })

  it.each([
    ['Action', Action, 'Add Toast'],
    ['Update', Update, 'Create Toast'],
  ] as const)('matches the %s example wrapper structure', async (_, component, buttonLabel) => {
    const screen = await render(component)
    const button = screen.getByText(buttonLabel).element() as HTMLButtonElement
    expect(button.parentElement?.tagName).toBe('DIV')
    expect(button.parentElement).toBe(screen.container.firstElementChild)
  })

  it('creates multiple toasts', async () => {
    await render(Basic, { props: { duration: testToastDuration } })
    const button = page.getByText('Create Toast')
    await userEvent.click(button)
    await userEvent.click(button)
    await userEvent.click(button)
    await vi.waitFor(() => {
      expect(document.querySelectorAll('[data-scope="toast"][data-part="title"]')).toHaveLength(3)
    })
  })

  it.each([
    ['Success', 'Success Toast'],
    ['Error', 'Error Toast'],
    ['Loading', 'Loading Toast'],
    ['Info', 'Info Toast'],
  ])('creates a %s toast', async (button, title) => {
    await render(ToastTypes, { props: { duration: testToastDuration } })
    await userEvent.click(page.getByText(button))
    await vi.waitFor(async () => expect.element(page.getByText(title)).toBeVisible())
  })

  it('runs the toast action', async () => {
    await render(ToastAction, { props: { duration: testToastDuration } })
    await userEvent.click(page.getByText('Create Toast'))
    await vi.waitFor(async () => expect.element(page.getByText('Undo')).toBeVisible())
    await userEvent.click(page.getByText('Undo'))
    await expect.element(page.getByText('Action triggered!')).toBeVisible()
  })

  it('updates resolved and rejected promises', async () => {
    const success = await render(ToastPromise, {
      props: { duration: testToastDuration, promiseDelay: testPromiseDelay },
    })
    await userEvent.click(success.getByText('Promise Success'))
    await expect.element(page.getByText('Loading...')).toBeVisible()
    await vi.waitFor(async () => expect.element(page.getByText('Success!')).toBeVisible(), {
      timeout: testPromiseDelay + 3_000,
    })
    success.unmount()

    await render(ToastPromise, {
      props: { duration: testToastDuration, promiseDelay: testPromiseDelay },
    })
    await userEvent.click(page.getByText('Promise Error'))
    await expect.element(page.getByText('Loading...')).toBeVisible()
    await vi.waitFor(async () => expect.element(page.getByText('Failed!')).toBeVisible(), {
      timeout: testPromiseDelay + 3_000,
    })
  }, promiseTestTimeout)

  it('updates an existing toast', async () => {
    await render(ToastUpdate, { props: { duration: testToastDuration } })
    await userEvent.click(page.getByText('Create Toast'))
    await expect.element(page.getByText('Original Title')).toBeVisible()
    await userEvent.click(page.getByText('Update Toast'))
    await vi.waitFor(async () => expect.element(page.getByText('Updated Title')).toBeVisible())
    await expect.element(page.getByText('Original Title')).not.toBeInTheDocument()
  })

  it.each([
    ['Top Start', 'top-start'],
    ['Bottom End', 'bottom-end'],
  ])('renders %s placement', async (button, placement) => {
    await render(ToastPlacement)
    await userEvent.click(page.getByText(button))
    await vi.waitFor(() => {
      expect(document.querySelector(`[data-scope="toast"][data-part="group"][data-placement="${placement}"]`)).toBeInTheDocument()
    })
  })
})

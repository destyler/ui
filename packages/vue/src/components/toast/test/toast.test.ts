import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import ToastAction from '../examples/ToastAction.vue'
import ToastPlacement from '../examples/ToastPlacement.vue'
import ToastPromise from '../examples/ToastPromise.vue'
import ToastTypes from '../examples/ToastTypes.vue'
import ToastUpdate from '../examples/ToastUpdate.vue'
import { Toast, toastAnatomy } from '../index'

describe('[toast] component', () => {
  it.each(getParts(toastAnatomy))('should render part %s', async (part) => {
    render(Basic)
    await userEvent.click(page.getByText('Create Toast'))
    await vi.waitFor(async () => {
      const element = document.querySelector(part) as HTMLElement | null
      await expect.element(element).toBeInTheDocument()
    })
  })

  it.each(getExports(toastAnatomy).filter(part => part !== 'Group'))('should export %s', async (part) => {
    expect(Toast[part as keyof typeof Toast]).toBeDefined()
  })

  describe('toast creation', () => {
    it('should show toast when create button is clicked', async () => {
      render(Basic)

      await userEvent.click(page.getByText('Create Toast'))

      await vi.waitFor(async () => await expect.element(page.getByText('Title')).toBeVisible())
      await vi.waitFor(async () => await expect.element(page.getByText('Description')).toBeVisible())
    })

    it('should create multiple toasts', async () => {
      render(Basic)

      await userEvent.click(page.getByText('Create Toast'))
      await userEvent.click(page.getByText('Create Toast'))
      await userEvent.click(page.getByText('Create Toast'))

      await vi.waitFor(async () => {
        const titles = document.querySelectorAll('[data-scope="toast"][data-part="title"]')
        expect(titles.length).toBe(3)
      })
    })
  })

  describe('toast dismissal', () => {
    it('should close toast when close trigger is clicked', async () => {
      render(Basic)

      await userEvent.click(page.getByText('Create Toast'))
      await vi.waitFor(async () => await expect.element(page.getByText('Title')).toBeVisible())

      await userEvent.click(page.getByText('x'))
      await vi.waitFor(async () => await expect.element(page.getByText('Title')).not.toBeInTheDocument())
    })
  })

  describe('toast types', () => {
    it('should create success toast', async () => {
      render(ToastTypes)

      await userEvent.click(page.getByText('Success'))
      await vi.waitFor(async () => await expect.element(page.getByText('Success Toast')).toBeVisible())
    })

    it('should create error toast', async () => {
      render(ToastTypes)

      await userEvent.click(page.getByText('Error'))
      await vi.waitFor(async () => await expect.element(page.getByText('Error Toast')).toBeVisible())
    })

    it('should create loading toast', async () => {
      render(ToastTypes)

      await userEvent.click(page.getByText('Loading'))
      await vi.waitFor(async () => await expect.element(page.getByText('Loading Toast')).toBeVisible())
    })

    it('should create info toast', async () => {
      render(ToastTypes)

      await userEvent.click(page.getByText('Info'))
      await vi.waitFor(async () => await expect.element(page.getByText('Info Toast')).toBeVisible())
    })
  })

  describe('toast action', () => {
    it('should trigger action callback when action button is clicked', async () => {
      render(ToastAction)

      await userEvent.click(page.getByText('Create Toast'))
      await vi.waitFor(async () => await expect.element(page.getByText('Undo')).toBeVisible())

      await userEvent.click(page.getByText('Undo'))
      await vi.waitFor(async () => await expect.element(page.getByText('Action triggered!')).toBeVisible())
    })
  })

  describe('toast promise', () => {
    it('should show loading then success toast for resolved promise', async () => {
      render(ToastPromise)

      await userEvent.click(page.getByText('Promise Success'))
      await vi.waitFor(async () => await expect.element(page.getByText('Loading...')).toBeVisible())
      await vi.waitFor(async () => await expect.element(page.getByText('Success!')).toBeVisible(), { timeout: 3000 })
    })

    it('should show loading then error toast for rejected promise', async () => {
      render(ToastPromise)

      await userEvent.click(page.getByText('Promise Error'))
      await vi.waitFor(async () => await expect.element(page.getByText('Loading...')).toBeVisible())
      await vi.waitFor(async () => await expect.element(page.getByText('Failed!')).toBeVisible(), { timeout: 3000 })
    })
  })

  describe('toast update', () => {
    it('should update existing toast', async () => {
      render(ToastUpdate)

      await userEvent.click(page.getByText('Create Toast'))
      await vi.waitFor(async () => await expect.element(page.getByText('Original Title')).toBeVisible())

      await userEvent.click(page.getByText('Update Toast'))
      await vi.waitFor(async () => await expect.element(page.getByText('Updated Title')).toBeVisible())
      await vi.waitFor(async () => await expect.element(page.getByText('Original Title')).not.toBeInTheDocument())
    })
  })

  describe('toast placement', () => {
    it('should render toast in top-start position', async () => {
      render(ToastPlacement)

      await userEvent.click(page.getByText('Top Start'))
      await vi.waitFor(async () => {
        const group = document.querySelector('[data-scope="toast"][data-part="group"][data-placement="top-start"]')
        expect(group).toBeInTheDocument()
      })
    })

    it('should render toast in bottom-end position', async () => {
      render(ToastPlacement)

      await userEvent.click(page.getByText('Bottom End'))
      await vi.waitFor(async () => {
        const group = document.querySelector('[data-scope="toast"][data-part="group"][data-placement="bottom-end"]')
        expect(group).toBeInTheDocument()
      })
    })
  })
})

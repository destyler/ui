import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-vue'
import { getExports, getParts } from '../../../../../../utils/test'
import Basic from '../examples/Basic.vue'
import RootProvider from '../examples/RootProvider.vue'
import { Steps, stepsAnatomy } from '../index'

describe('[steps] component', () => {
  it.each(getParts(stepsAnatomy).filter(part => !part.includes('progress')))('should render part %s', async (part) => {
    render(Basic)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(stepsAnatomy))('should export %s', async (part) => {
    expect(Steps[part]).toBeDefined()
  })

  describe('basic example', () => {
    it('should render initial step content', async () => {
      const screen = render(Basic)
      await expect.element(screen.getByText('First - Contact Info')).toBeVisible()
    })

    it('should navigate to next step on Next button click', async () => {
      const screen = render(Basic)
      await screen.getByText('Next').click()
      await expect.element(screen.getByText('Second - Date & Time')).toBeVisible()
    })

    it('should navigate to previous step on Prev button click', async () => {
      const screen = render(Basic)
      await screen.getByText('Next').click()
      await screen.getByText('Back').click()
      await expect.element(screen.getByText('First - Contact Info')).toBeVisible()
    })

    it('should show completed content after last step', async () => {
      const screen = render(Basic)
      await screen.getByText('Next').click()
      await screen.getByText('Next').click()
      await screen.getByText('Next').click()
      await expect.element(screen.getByText('Steps Complete - Thank you for filling out the form!')).toBeVisible()
    })
  })

  describe('rootProvider example', () => {
    it('should render initial step content', async () => {
      const screen = render(RootProvider)
      await expect.element(screen.getByText('First - Contact Info')).toBeVisible()
    })

    it('should navigate to next step on Next button click', async () => {
      const screen = render(RootProvider)
      await screen.getByText('Next').click()
      await expect.element(screen.getByText('Second - Date & Time')).toBeVisible()
    })

    it('should reset to first step on Reset button click', async () => {
      const screen = render(RootProvider)
      await screen.getByText('Next').click()
      await screen.getByText('Reset').click()
      await expect.element(screen.getByText('First - Contact Info')).toBeVisible()
    })
  })
})

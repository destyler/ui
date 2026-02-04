import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { RootProvider } from '../examples/RootProvider'
import { Steps, stepsAnatomy } from '../index'

describe('[steps] component', () => {
  it.each(getParts(stepsAnatomy).filter(part => !part.includes('progress')))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(stepsAnatomy))('should export %s', async (part) => {
    expect(Steps[part]).toBeDefined()
  })

  describe('basic example', () => {
    it('should render initial step content', async () => {
      render(<Basic />)
      await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    })

    it('should navigate to next step on Next button click', async () => {
      render(<Basic />)
      await page.getByText('Next').click()
      await expect.element(page.getByText('Second - Date & Time')).toBeVisible()
    })

    it('should navigate to previous step on Prev button click', async () => {
      render(<Basic />)
      await page.getByText('Next').click()
      await page.getByText('Back').click()
      await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    })

    it('should show completed content after last step', async () => {
      render(<Basic />)
      await page.getByText('Next').click()
      await page.getByText('Next').click()
      await page.getByText('Next').click()
      await expect.element(page.getByText('Steps Complete - Thank you for filling out the form!')).toBeVisible()
    })
  })

  describe('rootProvider example', () => {
    it('should render initial step content', async () => {
      render(<RootProvider />)
      await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    })

    it('should navigate to next step on Next button click', async () => {
      render(<RootProvider />)
      await page.getByText('Next').click()
      await expect.element(page.getByText('Second - Date & Time')).toBeVisible()
    })

    it('should reset to first step on Reset button click', async () => {
      render(<RootProvider />)
      await page.getByText('Next').click()
      await page.getByText('Reset').click()
      await expect.element(page.getByText('First - Contact Info')).toBeVisible()
    })
  })
})

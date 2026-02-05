import { describe, expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { page, userEvent } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Dialog, dialogAnatomy } from '../index'

describe('[dialog] component', () => {
  it.each(getParts(dialogAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(dialogAnatomy))('should export %s', async (part) => {
    expect(Dialog[part]).toBeDefined()
  })

  it('should show dialog content when opened', async () => {
    render(<Basic />)

    await userEvent.click(page.getByText('Open Dialog'))

    await vi.waitFor(async () => await expect.element(page.getByText('Dialog Title')).toBeVisible())

    await userEvent.click(page.getByText('Close'))
    await vi.waitFor(async () => await expect.element(page.getByText('Dialog Title')).not.toBeVisible())
  })
})

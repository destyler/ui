import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { RootProvider } from '../examples/RootProvider'
import { Label, labelAnatomy } from '../index'

describe('[label] component', () => {
  it.each(getParts(labelAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(labelAnatomy))('should export %s', async (part) => {
    expect(Label[part]).toBeDefined()
  })

  it('should render label text', async () => {
    render(<Basic />)
    await expect.element(page.getByText('Username')).toBeVisible()
  })

  it('should work with RootProvider', async () => {
    render(<RootProvider />)
    await expect.element(page.getByText('Email Address')).toBeVisible()
  })
})

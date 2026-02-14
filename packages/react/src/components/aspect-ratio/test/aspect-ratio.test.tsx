import { describe, expect, it } from 'vitest'
import { render } from 'vitest-browser-react'
import { page } from 'vitest/browser'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Portrait } from '../examples/Portrait'
import { RootProvider } from '../examples/RootProvider'
import { Square } from '../examples/Square'
import { AspectRatio, aspectRatioAnatomy } from '../index'

describe('[aspect-ratio] component', () => {
  it.each(getParts(aspectRatioAnatomy))('should render part %s', async (part) => {
    render(<Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(aspectRatioAnatomy))('should export %s', async (part) => {
    expect(AspectRatio[part]).toBeDefined()
  })

  it('should render 16:9 aspect ratio', async () => {
    render(<Basic />)
    await expect.element(page.getByRole('img')).toBeVisible()
  })

  it('should render 1:1 square aspect ratio', async () => {
    render(<Square />)
    await expect.element(page.getByText('1:1')).toBeVisible()
  })

  it('should render 9:16 portrait aspect ratio', async () => {
    render(<Portrait />)
    await expect.element(page.getByRole('img')).toBeVisible()
  })

  it('should work with RootProvider', async () => {
    render(<RootProvider />)
    await expect.element(page.getByRole('img')).toBeVisible()
  })
})

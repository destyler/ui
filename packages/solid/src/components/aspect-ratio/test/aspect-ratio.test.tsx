import { render, screen } from '@solidjs/testing-library'
import { AspectRatio, aspectRatioAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { Portrait } from '../examples/Portrait'
import { RootProvider } from '../examples/RootProvider'
import { Square } from '../examples/Square'

describe('aspectRatio', () => {
  it.each(getParts(aspectRatioAnatomy))('should render part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(aspectRatioAnatomy))('should export %s', (part) => {
    expect(AspectRatio[part]).toBeDefined()
  })

  it('should render a 16:9 aspect ratio', () => {
    render(() => <Basic />)
    const root = document.querySelector<HTMLElement>(
      '[data-scope="aspect-ratio"][data-part="root"]',
    )
    expect(root?.style.paddingBottom).toBe('56.25%')
    expect(screen.getByRole('img', { name: 'Sunset' })).toBeVisible()
  })

  it('should render a square aspect ratio', () => {
    render(() => <Square />)
    const root = document.querySelector<HTMLElement>(
      '[data-scope="aspect-ratio"][data-part="root"]',
    )
    expect(root?.style.paddingBottom).toBe('100%')
    expect(screen.getByText('1:1')).toBeVisible()
  })

  it('should render a portrait aspect ratio', () => {
    render(() => <Portrait />)
    const root = document.querySelector<HTMLElement>(
      '[data-scope="aspect-ratio"][data-part="root"]',
    )
    expect(root?.style.paddingBottom).toBe('177.778%')
  })

  it('should work with RootProvider', () => {
    render(() => <RootProvider />)
    const root = document.querySelector<HTMLElement>(
      '[data-scope="aspect-ratio"][data-part="root"]',
    )
    expect(root?.style.paddingBottom).toBe('75%')
    expect(screen.getByRole('img', { name: 'Sunset' })).toBeVisible()
  })
})

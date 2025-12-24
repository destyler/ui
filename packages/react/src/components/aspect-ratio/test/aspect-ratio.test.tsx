import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { Portrait } from '../examples/Portrait'
import { RootProvider as RootProviderExample } from '../examples/RootProvider'
import { Square } from '../examples/Square'
import { AspectRatio, aspectRatioAnatomy } from '../index'

describe('[aspect-ratio] component', () => {
  const [rootSelector] = getParts(aspectRatioAnatomy)

  it.each(getParts(aspectRatioAnatomy))('should render part %s', (part) => {
    const { container } = render(<Basic />)
    expect(container.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(aspectRatioAnatomy))('should export %s', (part) => {
    expect(AspectRatio[part]).toBeDefined()
  })

  it('should render 16:9 aspect ratio', () => {
    const { container, getByRole } = render(<Basic />)
    const root = container.querySelector(rootSelector)
    expect(root).toHaveStyle({ paddingBottom: '56.25%' })
    expect(getByRole('img', { name: 'Sunset over the mountains' })).toBeInTheDocument()
  })

  it('should render 1:1 square aspect ratio', () => {
    const { container, getByText } = render(<Square />)
    const root = container.querySelector(rootSelector)
    expect(root).toHaveStyle({ paddingBottom: '100%' })
    expect(getByText('1:1')).toBeInTheDocument()
  })

  it('should render 9:16 portrait aspect ratio', () => {
    const { container, getByRole } = render(<Portrait />)
    const root = container.querySelector(rootSelector)
    expect(root).toHaveStyle({ paddingBottom: '177.77777777777777%' })
    expect(getByRole('img', { name: 'Portrait aspect ratio example' })).toBeInTheDocument()
  })

  it('should work with RootProvider', () => {
    const { container, getByRole } = render(<RootProviderExample />)
    const root = container.querySelector(rootSelector)
    expect(root).toHaveStyle({ paddingBottom: '75%' })
    expect(getByRole('img', { name: 'Root provider aspect ratio example' })).toBeInTheDocument()
  })
})

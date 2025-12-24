import { render } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { describe, expect, it } from 'vitest'
import { getExports, getParts } from '../../../../../../utils/test'
import { Basic } from '../examples/Basic'
import { AspectRatio, aspectRatioAnatomy } from '../index'

describe('[aspect-ratio] component', () => {
  it.each(getParts(aspectRatioAnatomy))('should render part %s', (part) => {
    const { container } = render(<Basic />)
    expect(container.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(aspectRatioAnatomy))('should export %s', (part) => {
    expect(AspectRatio[part]).toBeDefined()
  })
})

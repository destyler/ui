import { render, screen } from '@solidjs/testing-library'
import { Separator, separatorAnatomy, useSeparator } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic } from '../examples/Basic'
import { RootProvider } from '../examples/RootProvider'
import { Vertical } from '../examples/Vertical'

describe('separator', () => {
  it.each(getParts(separatorAnatomy))('should render part %s', (part) => {
    render(() => <Basic />)
    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(separatorAnatomy))('should export %s', (part) => {
    expect(Separator[part]).toBeDefined()
  })

  it('should render a horizontal separator by default', () => {
    render(() => <Basic />)
    const separator = document.querySelector('[data-scope="separator"][data-part="root"]')

    expect(separator).toHaveAttribute('role', 'separator')
    expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  })

  it('should render vertical separators with aria-orientation', () => {
    render(() => <Vertical />)
    const separators = document.querySelectorAll('[data-orientation="vertical"]')

    expect(separators).toHaveLength(2)
    for (const separator of separators) {
      expect(separator).toHaveAttribute('aria-orientation', 'vertical')
      expect(separator).toHaveStyle({ height: '16px' })
    }
  })

  it('should work with RootProvider', () => {
    render(() => <RootProvider />)
    expect(document.querySelector('[data-scope="separator"][data-part="root"]')).toBeInTheDocument()
  })

  it('should expose its state through Context', () => {
    const ContextUnderTest = () => {
      const separator = useSeparator({ orientation: 'vertical' })
      return (
        <Separator.RootProvider value={separator}>
          <Separator.Context>
            {api => <span>{api().isVertical ? 'vertical' : 'horizontal'}</span>}
          </Separator.Context>
        </Separator.RootProvider>
      )
    }

    render(() => <ContextUnderTest />)

    expect(screen.getByText('vertical')).toBeVisible()
  })
})

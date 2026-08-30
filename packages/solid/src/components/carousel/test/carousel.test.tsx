import { render, screen, waitFor } from '@solidjs/testing-library'
import { Carousel, carouselAnatomy } from '../'
import { getExports, getParts } from '../../../setup-test'
import { Basic as ComponentUnderTest } from '../examples/Basic'

describe('carousel', () => {
  const renderedParts = getParts(carouselAnatomy).filter(
    part => !part.includes('[data-part="autoplay-trigger"]'),
  )
  it.each(renderedParts)('should render part %s', async (part) => {
    render(() => <ComponentUnderTest />)

    expect(document.querySelector(part)).toBeInTheDocument()
  })

  it.each(getExports(carouselAnatomy))('should export %s', async (part) => {
    expect(Carousel[part]).toBeDefined()
  })

  it('should have the correct disabled / enabled states for control buttons', async () => {
    render(() => <ComponentUnderTest />)
    const prevButton = screen.getByRole('button', { name: 'Previous slide' })
    const nextButton = screen.getByRole('button', { name: 'Next slide' })

    await waitFor(() => expect(prevButton).toBeDisabled())
    await waitFor(() => expect(nextButton).toBeEnabled())
  })

  it('should use defaultPage as the initial page', async () => {
    render(() => (
      <Carousel.Root defaultPage={2} slideCount={5}>
        <Carousel.IndicatorGroup>
          <Carousel.Indicator index={0}>first</Carousel.Indicator>
          <Carousel.Indicator index={1}>second</Carousel.Indicator>
          <Carousel.Indicator index={2}>third</Carousel.Indicator>
          <Carousel.Indicator index={3}>fourth</Carousel.Indicator>
          <Carousel.Indicator index={4}>fifth</Carousel.Indicator>
        </Carousel.IndicatorGroup>
        <Carousel.ItemGroup>
          <Carousel.Item index={0}>first slide</Carousel.Item>
          <Carousel.Item index={1}>second slide</Carousel.Item>
          <Carousel.Item index={2}>third slide</Carousel.Item>
          <Carousel.Item index={3}>fourth slide</Carousel.Item>
          <Carousel.Item index={4}>fifth slide</Carousel.Item>
        </Carousel.ItemGroup>
      </Carousel.Root>
    ))

    await waitFor(() => expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('data-current'))
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).not.toHaveAttribute('data-current')
  })
})

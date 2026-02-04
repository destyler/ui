import { Carousel, useCarousel } from '../index'

const images = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i + 1}/500/300`)

export function RootProvider() {
  const carousel = useCarousel()

  return (
    <>
      <button onClick={() => carousel.scrollToIndex(2)}>Scroll to #3</button>
      <Carousel.RootProvider value={carousel}>
        <Carousel.Control>
          <Carousel.PrevTrigger>Previous</Carousel.PrevTrigger>
          <Carousel.NextTrigger>Next</Carousel.NextTrigger>
        </Carousel.Control>
        <Carousel.IndicatorGroup>
          {images.map((_, idx) => (
            <Carousel.Indicator key={idx} index={idx} />
          ))}
        </Carousel.IndicatorGroup>
        <Carousel.ItemGroup>
          {images.map((image, idx) => (
            <Carousel.Item key={idx} index={idx}>
              <img
                src={image}
                alt=""
                style={{ height: '300px', width: '100%', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>
      </Carousel.RootProvider>
    </>
  )
}

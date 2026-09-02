import { Carousel } from '@destyler-ui/solid/carousel'
import { createSignal, Index } from 'solid-js'

const images = Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${i + 1}/500/300`)

export function Controlled() {
  const [page, setPage] = createSignal(0)

  return (
    <>
      <Carousel.Root page={page()} onPageChange={details => setPage(details.page)}>
        <Carousel.Control>
          <Carousel.PrevTrigger>Previous</Carousel.PrevTrigger>
          <Carousel.NextTrigger>Next</Carousel.NextTrigger>
        </Carousel.Control>
        <Carousel.IndicatorGroup>
          <Index each={images}>{(_, index) => <Carousel.Indicator index={index} />}</Index>
        </Carousel.IndicatorGroup>
        <Carousel.ItemGroup>
          <Index each={images}>
            {(image, index) => (
              <Carousel.Item index={index}>
                <img src={image()} alt={`Slide ${index}`} />
              </Carousel.Item>
            )}
          </Index>
        </Carousel.ItemGroup>
      </Carousel.Root>
    </>
  )
}

<script lang="ts">
  import { Carousel, useCarousel } from '../index'
  const images = Array.from({ length: 5 }, (_, index) => `https://picsum.photos/seed/${index + 1}/500/300`)
  const id = $props.id()
  const carousel = useCarousel({ id })
</script>

<main>
  <button type="button" onclick={() => carousel().scrollToIndex(2)}>Scroll to #3</button>
  <Carousel.RootProvider value={carousel}>
    <Carousel.Control><Carousel.PrevTrigger>Previous</Carousel.PrevTrigger><Carousel.NextTrigger>Next</Carousel.NextTrigger></Carousel.Control>
    <Carousel.IndicatorGroup>{#each images as _, index}<Carousel.Indicator {index} />{/each}</Carousel.IndicatorGroup>
    <Carousel.ItemGroup>{#each images as image, index}<Carousel.Item {index}><img src={image} alt="" style="height: 300px; width: 100%; object-fit: cover;" /></Carousel.Item>{/each}</Carousel.ItemGroup>
  </Carousel.RootProvider>
</main>

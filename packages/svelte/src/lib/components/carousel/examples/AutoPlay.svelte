<script lang="ts">
  import { Carousel } from '../index'
  const images = Array.from({ length: 5 }, (_, index) => `https://picsum.photos/seed/${index + 1}/500/300`)
</script>

<Carousel.Root autoplay loop>
  <Carousel.Control>
    <Carousel.PrevTrigger>Previous</Carousel.PrevTrigger><Carousel.NextTrigger>Next</Carousel.NextTrigger>
    <Carousel.AutoplayTrigger><Carousel.Context>{#snippet render(api)}{api().isPlaying ? 'Pause' : 'Play'}{/snippet}</Carousel.Context></Carousel.AutoplayTrigger>
  </Carousel.Control>
  <Carousel.IndicatorGroup>{#each images as _, index}<Carousel.Indicator {index} />{/each}</Carousel.IndicatorGroup>
  <Carousel.ItemGroup>{#each images as image, index}<Carousel.Item {index}><img src={image} alt="" style="height: 300px; width: 100%; object-fit: cover;" /></Carousel.Item>{/each}</Carousel.ItemGroup>
</Carousel.Root>

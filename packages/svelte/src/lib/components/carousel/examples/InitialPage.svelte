<script lang="ts">
  import { Carousel } from '../index'
  const images = Array.from({ length: 5 }, (_, index) => `https://picsum.photos/seed/${index + 1}/500/300`)
</script>

<Carousel.Root defaultPage={2}>

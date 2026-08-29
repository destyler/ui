<script lang="ts">
  import { AspectRatio } from '../index'
</script>

<main style="width: 300px;">
  <AspectRatio.Root ratio={16 / 9}>
    <AspectRatio.Content>
      <img
        src="https://elonehoo.me/gallery/20_sun.jpg"
        alt="Sunset"
        style="width: 100%; height: 100%; object-fit: cover;"
      />
    </AspectRatio.Content>
  </AspectRatio.Root>
</main>

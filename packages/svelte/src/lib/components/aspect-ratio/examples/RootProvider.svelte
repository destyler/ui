<script lang="ts">
  import { AspectRatio, useAspectRatio } from '../index'

  const id = $props.id()
  const aspectRatio = useAspectRatio({ id, ratio: 4 / 3 })
</script>

<main style="width: 300px;">
  <AspectRatio.RootProvider value={aspectRatio}>
    <AspectRatio.Content>
      <img src="https://elonehoo.me/gallery/20_sun.jpg" alt="Sunset" style="width: 100%; height: 100%; object-fit: cover;" />
    </AspectRatio.Content>
  </AspectRatio.RootProvider>
</main>

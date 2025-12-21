<script setup lang="ts">
import { AspectRatio, useAspectRatio } from '../index'
import { computed } from 'vue'

const aspectRatio = useAspectRatio({ ratio: 4 / 3 })
</script>

<template>
  <main style="width: 300px;">
    <AspectRatio.RootProvider :value="aspectRatio">
      <AspectRatio.Content>
        <img
          src="https://elonehoo.me/gallery/20_sun.jpg"
          style="object-fit: cover; width: 100%; height: 100%;"
        >
      </AspectRatio.Content>
    </AspectRatio.RootProvider>
  </main>
</template>

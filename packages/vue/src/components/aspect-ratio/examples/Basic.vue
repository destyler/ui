<script setup lang="ts">
import { AspectRatio } from '../index'
</script>

<template>
  <main style="width: 300px;">
    <AspectRatio.Root :ratio="16 / 9">
      <AspectRatio.Content>
        <img
          src="https://elonehoo.me/gallery/20_sun.jpg"
          style="object-fit: cover; width: 100%; height: 100%;"
        >
      </AspectRatio.Content>
    </AspectRatio.Root>
  </main>
</template>

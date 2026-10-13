<script setup lang="ts">
import { AspectRatio } from '../index'

const props = withDefaults(defineProps<{ src?: string }>(), {
  src: 'https://cover.sli.dev',
})
</script>

<template>
  <main>
    <AspectRatio.Root :ratio="9 / 16">
      <AspectRatio.Content>
        <img :src="props.src">
      </AspectRatio.Content>
    </AspectRatio.Root>
  </main>
</template>

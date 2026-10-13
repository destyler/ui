<script setup lang="ts">
import { AspectRatio, useAspectRatio } from '../index'

const props = withDefaults(defineProps<{ src?: string }>(), {
  src: 'https://cover.sli.dev',
})

const aspectRatio = useAspectRatio({ ratio: 4 / 3 })
</script>

<template>
  <main>
    <AspectRatio.RootProvider :value="aspectRatio">
      <AspectRatio.Content>
        <img :src="props.src">
      </AspectRatio.Content>
    </AspectRatio.RootProvider>
  </main>
</template>

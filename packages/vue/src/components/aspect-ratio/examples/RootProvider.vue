<script setup lang="ts">
import { AspectRatio, useAspectRatio } from '../index'

const aspectRatio = useAspectRatio({ ratio: 4 / 3 })
</script>

<template>
  <main>
    <AspectRatio.RootProvider :value="aspectRatio">
      <AspectRatio.Content>
        <img src="https://cover.sli.dev">
      </AspectRatio.Content>
    </AspectRatio.RootProvider>
  </main>
</template>

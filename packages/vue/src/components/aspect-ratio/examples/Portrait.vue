<script setup lang="ts">
import { AspectRatio } from '../index'
</script>

<template>
  <main>
    <AspectRatio.Root :ratio="9 / 16">
      <AspectRatio.Content>
        <img src="https://cover.sli.dev">
      </AspectRatio.Content>
    </AspectRatio.Root>
  </main>
</template>

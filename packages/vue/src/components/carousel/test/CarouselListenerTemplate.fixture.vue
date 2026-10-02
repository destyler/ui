<script setup lang="ts">
import { Carousel } from '../index'
defineProps<{ mode: string, first: (event: Event) => void, second: (event: Event) => void }>()
</script>
<template>
  <Carousel.NextTrigger v-if="mode === 'array'" v-bind="{ onClick: first }" data-testid="control" @click="second">Next</Carousel.NextTrigger>
  <Carousel.NextTrigger v-else :onClick="null" data-testid="control">Next</Carousel.NextTrigger>
</template>

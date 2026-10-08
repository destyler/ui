<script setup lang="ts">
import { Carousel } from '../index'
</script>
<template>
  <Carousel.NextTrigger as-child>
    <slot><button data-testid="fallback-target">Fallback</button></slot>
  </Carousel.NextTrigger>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineOptions({
  name: 'ClientOnly',
})

export type ClientOnlyProps = {}

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})
</script>

<template>
  <template v-if="isClient">
    <slot />
  </template>
  <template v-else>
    <slot name="fallback" />
  </template>
</template>

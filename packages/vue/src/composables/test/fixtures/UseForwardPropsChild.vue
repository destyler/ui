<script setup lang="ts">
defineProps<{
  title: string
  variant?: string
}>()
</script>

<template>
  <div
    data-testid="child"
    :data-variant="variant"
  >
    {{ title }}
  </div>
</template>

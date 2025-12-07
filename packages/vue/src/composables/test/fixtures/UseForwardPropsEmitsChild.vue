<script setup lang="ts">
defineProps<{
  label: string
  value?: string
  onUpdate?: (value: string) => void
}>()
</script>

<template>
  <div>
    <span data-testid="child-label">{{ label }}</span>
    <span data-testid="child-value">{{ value }}</span>
    <button data-testid="child-button" @click="onUpdate?.('child-clicked')">
      Child Click
    </button>
  </div>
</template>

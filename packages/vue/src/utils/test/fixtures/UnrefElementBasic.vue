<script setup lang="ts">
import { computed, ref } from 'vue'
import { unrefElement } from '~/utils/unref-element'

const props = withDefaults(defineProps<{
  showElement?: boolean
}>(), {
  showElement: true,
})

const elementRef = ref<HTMLElement | null>(null)

const result = computed(() => {
  const el = unrefElement(elementRef)
  return el?.nodeName ?? 'null'
})
</script>

<template>
  <div>
    <div v-if="showElement" ref="elementRef">
      Target Element
    </div>
    <div data-testid="result">
      {{ result }}
    </div>
  </div>
</template>

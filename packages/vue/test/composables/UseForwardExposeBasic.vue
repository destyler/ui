<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useForwardExpose } from '~/composables/use-forward-expose'

const props = withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Default Title',
})

const { forwardRef, currentRef } = useForwardExpose()

const result = ref('loading')

watch(currentRef, (val) => {
  if (val) {
    result.value = (val as HTMLElement)?.nodeName ?? 'null'
  }
}, { immediate: true })

onMounted(async () => {
  await nextTick()
  if (currentRef.value) {
    result.value = (currentRef.value as HTMLElement)?.nodeName ?? 'null'
  }
})
</script>

<template>
  <div>
    <div :ref="forwardRef" data-testid="target">
      Target
    </div>
    <div data-testid="result">
      {{ result }}
    </div>
    <div data-testid="title">
      {{ props.title }}
    </div>
  </div>
</template>

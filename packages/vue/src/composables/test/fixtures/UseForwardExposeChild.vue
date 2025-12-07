<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useForwardExpose } from '~/composables/use-forward-expose'
import UseForwardExposeInner from './UseForwardExposeInner.vue'

const { forwardRef, currentRef } = useForwardExpose()

const result = ref('null')

onMounted(() => {
  const el = currentRef.value as any
  result.value = el?.$el?.nodeName ?? el?.nodeName ?? 'null'
})
</script>

<template>
  <div>
    <UseForwardExposeInner :ref="forwardRef" />
    <div data-testid="child-result">
      {{ result }}
    </div>
  </div>
</template>

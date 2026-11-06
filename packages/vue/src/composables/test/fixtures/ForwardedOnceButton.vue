<script setup lang="ts">
import { useAttrs } from 'vue'
import { useForwardExpose, useNativeEventProps } from '~/index'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const nativeProps = useNativeEventProps()
const { forwardRef } = useForwardExpose()
</script>

<template>
  <div class="button-shell">
    <button v-bind="nativeProps(attrs)" :ref="forwardRef">
      <slot />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRenderStrategyProps } from '~/composables/use-render-strategy'

const consumedProps = useRenderStrategyProps()

const lazyMountValue = computed(() => consumedProps?.value?.lazyMount ?? false)
const unmountOnExitValue = computed(() => consumedProps?.value?.unmountOnExit ?? false)
</script>

<template>
  <div>
    <div data-testid="lazy-mount">
      {{ lazyMountValue }}
    </div>
    <div data-testid="unmount-on-exit">
      {{ unmountOnExitValue }}
    </div>
  </div>
</template>

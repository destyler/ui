<script setup lang="ts">
import { computed, toRef } from 'vue'
import { RenderStrategyPropsProvider, useRenderStrategyProps } from '~/composables/use-render-strategy'
import UseRenderStrategyConsumer from './UseRenderStrategyConsumer.vue'

const props = withDefaults(defineProps<{
  lazyMount?: boolean
  unmountOnExit?: boolean
}>(), {
  lazyMount: false,
  unmountOnExit: false,
})

const strategyProps = computed(() => ({
  lazyMount: props.lazyMount,
  unmountOnExit: props.unmountOnExit,
}))

RenderStrategyPropsProvider(strategyProps)
</script>

<template>
  <UseRenderStrategyConsumer />
</template>

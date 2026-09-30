<script setup lang="ts">
import { computed } from 'vue'
import { RenderStrategyPropsProvider } from '~/composables/use-render-strategy'
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

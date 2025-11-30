<script setup lang="ts">
import { useForwardPropsEmits } from '~/composables/use-forward-props-emits'
import UseForwardPropsEmitsChild from './UseForwardPropsEmitsChild.vue'

const props = defineProps<{
  label: string
  value?: string
}>()

const emit = defineEmits<{
  update: [value: string]
}>()

const forwarded = useForwardPropsEmits(props, emit)
</script>

<template>
  <UseForwardPropsEmitsChild v-bind="forwarded" />
</template>

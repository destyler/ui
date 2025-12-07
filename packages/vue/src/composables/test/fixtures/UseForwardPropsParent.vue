<script setup lang="ts">
import { useForwardProps } from '~/composables/use-forward-props'
import UseForwardPropsChild from './UseForwardPropsChild.vue'

const props = defineProps<{
  title: string
  variant?: string
}>()

const forwarded = useForwardProps(props)
</script>

<template>
  <UseForwardPropsChild v-bind="forwarded" />
</template>

<script setup lang="ts">
import { useForwardProps } from '~/composables/use-forward-props'

const props = withDefaults(defineProps<{
  title: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const forwarded = useForwardProps(props)
</script>

<template>
  <div
    data-testid="forwarded"
    :data-disabled="String(forwarded.disabled)"
  >
    {{ forwarded.title }}
  </div>
</template>

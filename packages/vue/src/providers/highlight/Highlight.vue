<script lang="ts">
import type { UseHighlightProps } from './use-highlight'

export interface HighlightProps extends UseHighlightProps {}
</script>

<script lang="ts" setup>
import { useHighlight } from './use-highlight'

defineOptions({
  name: 'Highlight',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<HighlightProps>(), {
  ignoreCase: undefined,
  matchAll: undefined,
})

if (typeof props.text !== 'string') {
  throw new Error('[@destyler/highlight] text must be a string')
}

const chunks = useHighlight(props)
</script>

<template>
  <template v-for="chunk in chunks">
    <mark v-if="chunk.match" v-bind="$attrs">{{ chunk.text }}</mark>
    <template v-else>
      {{ chunk.text }}
    </template>
  </template>
</template>

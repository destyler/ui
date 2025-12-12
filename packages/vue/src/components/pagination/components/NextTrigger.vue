<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PaginationNextTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePaginationContext } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationNextTrigger',
})

defineProps<PaginationNextTriggerProps>()
const pagination = usePaginationContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="pagination.getNextTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>

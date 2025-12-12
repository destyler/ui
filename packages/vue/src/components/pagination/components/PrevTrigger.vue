<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface PaginationPrevTriggerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePaginationContext } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationPrevTrigger',
})

defineProps<PaginationPrevTriggerProps>()
const pagination = usePaginationContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="pagination.getPrevTriggerProps()" :as-child="asChild">
    <slot />
  </ui.button>
</template>

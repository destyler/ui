<script lang="ts">
import type { EllipsisProps } from '@destyler/pagination'
import type { PolymorphicProps } from '~/factory'

export interface PaginationEllipsisProps extends EllipsisProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePaginationContext } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationEllipsis',
})

const props = defineProps<PaginationEllipsisProps>()
const pagination = usePaginationContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="pagination.getEllipsisProps(props)" :as-child="asChild">
    <slot />
  </ui.div>
</template>

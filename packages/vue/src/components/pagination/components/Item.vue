<script lang="ts">
import type { ItemProps } from '@destyler/pagination'
import type { PolymorphicProps } from '~/factory'

export interface PaginationItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePaginationContext } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationItem',
})

const props = defineProps<PaginationItemProps>()
const pagination = usePaginationContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="pagination.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>

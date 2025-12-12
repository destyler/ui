<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface PaginationRootProps extends RootProps, PolymorphicProps {}
export interface PaginationRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { usePagination } from '../composables/use-pagination'
import { PaginationProvider } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationRoot',
})

const props = defineProps<PaginationRootProps>()
const emits = defineEmits<PaginationRootEmits>()

const pagination = usePagination(props, emits)
PaginationProvider(pagination)

useForwardExpose()
</script>

<template>
  <ui.nav v-bind="pagination.getRootProps()" :as-child="asChild">
    <slot />
  </ui.nav>
</template>

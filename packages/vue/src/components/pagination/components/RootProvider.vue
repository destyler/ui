<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UsePaginationReturn } from '../composables/use-pagination'

interface RootProviderProps {
  value: UnwrapRef<UsePaginationReturn>
}

export interface PaginationRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { PaginationProvider } from '../composables/use-pagination-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'PaginationRootProvider',
})

const props = defineProps<PaginationRootProviderProps>()
const pagination = computed(() => props.value)

PaginationProvider(pagination)

useForwardExpose()
</script>

<template>
  <ui.nav v-bind="pagination.getRootProps()" :as-child="asChild">
    <slot />
  </ui.nav>
</template>

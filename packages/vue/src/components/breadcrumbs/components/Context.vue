<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseBreadcrumbsContext } from '../composables/use-breadcrumbs-context'

export interface BreadcrumbsContextProps
  extends SlotsType<{
    default: UnwrapRef<UseBreadcrumbsContext>
  }> {}
</script>

<script setup lang="ts">
import { useBreadcrumbsContext } from '../composables/use-breadcrumbs-context'

defineOptions({
  name: 'BreadcrumbsContext',
})

const breadcrumbs = useBreadcrumbsContext()

defineSlots<{
  default(breadcrumbs: UnwrapRef<UseBreadcrumbsContext>): unknown
}>()
</script>

<template>
  <slot v-bind="breadcrumbs" />
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface BreadcrumbsListProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsList',
})

defineProps<BreadcrumbsListProps>()

const breadcrumbs = useBreadcrumbsContext()

useForwardExpose()
</script>

<template>
  <ui.ol v-bind="breadcrumbs.getListProps()" :as-child="asChild">
    <slot />
  </ui.ol>
</template>

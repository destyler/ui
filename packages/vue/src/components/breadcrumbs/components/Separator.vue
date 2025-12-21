<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface BreadcrumbsSeparatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsSeparator',
})

defineProps<BreadcrumbsSeparatorProps>()

const breadcrumbs = useBreadcrumbsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="breadcrumbs.getSeparatorProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>

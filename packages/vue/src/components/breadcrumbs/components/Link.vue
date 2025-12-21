<script lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import type { PolymorphicProps } from '~/factory'

export interface BreadcrumbsLinkProps extends PolymorphicProps {
  item: BreadcrumbItem
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsLink',
})

const props = defineProps<BreadcrumbsLinkProps>()

const breadcrumbs = useBreadcrumbsContext()

useForwardExpose()
</script>

<template>
  <ui.a v-bind="breadcrumbs.getLinkProps(props.item)" :as-child="asChild">
    <slot />
  </ui.a>
</template>

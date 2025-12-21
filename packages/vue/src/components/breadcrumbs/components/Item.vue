<script lang="ts">
import type { BreadcrumbItem } from '@destyler/breadcrumbs'
import type { PolymorphicProps } from '~/factory'

export interface BreadcrumbsItemProps extends PolymorphicProps {
  item: BreadcrumbItem
}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useBreadcrumbsContext } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsItem',
})

const props = defineProps<BreadcrumbsItemProps>()

const breadcrumbs = useBreadcrumbsContext()

useForwardExpose()
</script>

<template>
  <ui.li v-bind="breadcrumbs.getItemProps(props.item)" :as-child="asChild">
    <slot />
  </ui.li>
</template>

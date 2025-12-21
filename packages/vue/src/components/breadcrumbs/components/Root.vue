<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface BreadcrumbsRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useBreadcrumbs } from '../composables/use-breadcrumbs'
import { BreadcrumbsProvider } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsRoot',
})

const props = defineProps<BreadcrumbsRootProps>()

const breadcrumbs = useBreadcrumbs(props)

BreadcrumbsProvider(breadcrumbs)

useForwardExpose()
</script>

<template>
  <ui.nav v-bind="breadcrumbs.getRootProps()" :as-child="asChild">
    <slot />
  </ui.nav>
</template>

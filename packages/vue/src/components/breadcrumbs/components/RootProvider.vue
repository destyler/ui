<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseBreadcrumbsReturn } from '../composables/use-breadcrumbs'

interface RootProviderProps {
  value: UnwrapRef<UseBreadcrumbsReturn>
}

export interface BreadcrumbsRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { BreadcrumbsProvider } from '../composables/use-breadcrumbs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'BreadcrumbsRootProvider',
})

const props = defineProps<BreadcrumbsRootProviderProps>()
const breadcrumbs = computed(() => props.value)

BreadcrumbsProvider(breadcrumbs)

useForwardExpose()
</script>

<template>
  <ui.nav v-bind="breadcrumbs.getRootProps()" :as-child="asChild">
    <slot />
  </ui.nav>
</template>

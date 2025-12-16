<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TabIndicatorProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTabsContext } from '../composables/use-tabs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TabIndicator',
})

defineProps<TabIndicatorProps>()
const tabs = useTabsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tabs.getIndicatorProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TabListProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTabsContext } from '../composables/use-tabs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TabList',
})

defineProps<TabListProps>()
const tabs = useTabsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="tabs.getListProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

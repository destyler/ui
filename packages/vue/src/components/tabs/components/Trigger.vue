<script lang="ts">
import type { TriggerProps } from '@destyler/tabs'
import type { PolymorphicProps } from '~/factory'

export interface TabTriggerProps extends TriggerProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTabsContext } from '../composables/use-tabs-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'TabTrigger',
})

const props = defineProps<TabTriggerProps>()
const tabs = useTabsContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="tabs.getTriggerProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>

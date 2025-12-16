<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseTabsContext } from '../composables/use-tabs-context'

export interface TabsContextProps
  extends SlotsType<{
    default: UnwrapRef<UseTabsContext>
  }> {}
</script>

<script setup lang="ts">
import { useTabsContext } from '../composables/use-tabs-context'

defineOptions({
  name: 'TabsContext',
})

const tabs = useTabsContext()

defineSlots<{
  default(tabs: UnwrapRef<UseTabsContext>): unknown
}>()
</script>

<template>
  <slot v-bind="tabs"></slot>
</template>

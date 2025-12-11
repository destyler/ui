<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseMenuContext } from '../composables/use-menu-context'

export interface MenuContextProps
  extends SlotsType<{
    default: UnwrapRef<UseMenuContext>
  }> {}
</script>

<script setup lang="ts">
import { useMenuContext } from '../composables/use-menu-context'

defineOptions({
  name: 'MenuContext'
})

const menu = useMenuContext()

defineSlots<{
  default(menu: UnwrapRef<UseMenuContext>): unknown
}>()
</script>

<template>
  <slot v-bind="menu"></slot>
</template>

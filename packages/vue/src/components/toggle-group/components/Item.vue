<script lang="ts">
import type { ItemProps } from '@destyler/toggle'
import type { PolymorphicProps } from '~/factory'

export interface ToggleGroupItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useToggleGroupContext } from '../composables/use-toggle-group-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ToggleGroupItem'
})

const props = defineProps<ToggleGroupItemProps>()
const toggleGroup = useToggleGroupContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="toggleGroup.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.button>
</template>

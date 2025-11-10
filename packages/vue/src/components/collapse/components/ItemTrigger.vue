<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import { useCollapsibleContext } from '~/components/collapsible'
import type { PolymorphicProps } from '~/factory'

export interface CollapseItemTriggerBaseProps extends PolymorphicProps {}
export interface CollapseItemTriggerProps
  extends CollapseItemTriggerBaseProps,
    /**
     * @vue-ignore
     */
    ButtonHTMLAttributes {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { computed } from 'vue'
import { useCollapseContext } from '../composables/use-collapse-context'
import { useCollapseItemPropsContext } from '../composables/use-collapse-item-props-context'

defineProps<CollapseItemTriggerProps>()
const collapse = useCollapseContext()
const itemProps = useCollapseItemPropsContext()
const collapsible = useCollapsibleContext()
const triggerProps = computed(() => {
  const { 'aria-controls': ariaControls, ...otherProps } = collapse.value.getItemTriggerProps(itemProps)
  return {
    ...otherProps,
    ...(collapsible.value.unmounted ? {} : { 'aria-controls': ariaControls }),
  }
})
useForwardExpose()
</script>

<template>
  <ui.button v-bind="triggerProps" :as-child="asChild">
    <slot />
  </ui.button>
</template>

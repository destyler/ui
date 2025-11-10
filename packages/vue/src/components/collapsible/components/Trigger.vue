<script lang="ts">
import type { ButtonHTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface CollapsibleTriggerBaseProps extends PolymorphicProps {}
export interface CollapsibleTriggerProps
  extends CollapsibleTriggerBaseProps,
    /**
     * @vue-ignore
     */
    ButtonHTMLAttributes {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCollapsibleContext } from '../composables/use-collapsible-context'
import { useForwardExpose } from '~/composables'

defineProps<CollapsibleTriggerProps>()
const collapsible = useCollapsibleContext()

useForwardExpose()
</script>

<template>
  <ui.button v-bind="collapsible.getTriggerProps()">
    <slot />
  </ui.button>
</template>

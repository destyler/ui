<script lang="ts">
import type { HTMLAttributes } from 'vue'
import type { PolymorphicProps } from '~/factory'

export interface CollapsibleContentBaseProps extends PolymorphicProps {}
export interface CollapsibleContentProps extends CollapsibleContentBaseProps, HTMLAttributes {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCollapsibleContext } from '../composables/use-collapsible-context'
import { useForwardExpose } from '~/composables'

defineProps<CollapsibleContentProps>()
const collapsible = useCollapsibleContext()

useForwardExpose()
</script>

<template>
  <ui.div v-if="!collapsible.unmounted" v-bind="collapsible.getContentProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface CollapsibleContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useCollapsibleContext } from '../composables/use-collapsible-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<CollapsibleContentProps>()
const collapsible = useCollapsibleContext()

useForwardExpose()
</script>

<template>
  <ui.div v-if="!collapsible.unmounted" v-bind="collapsible.getContentProps()" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>

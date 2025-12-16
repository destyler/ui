<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SwitchLabelProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSwitchContext } from '../composables/use-switch-context'
import { useForwardExpose } from '~/composables'

defineProps<SwitchLabelProps>()
const context = useSwitchContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="context.getLabelProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>

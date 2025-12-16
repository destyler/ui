<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SwitchThumbProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSwitchContext } from '../composables/use-switch-context'
import { useForwardExpose } from '~/composables'

defineProps<SwitchThumbProps>()
const context = useSwitchContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="context.getThumbProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>

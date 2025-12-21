<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootProps } from '../types'

export interface SeparatorRootProps extends RootProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSeparator } from '../composables/use-separator'
import { SeparatorProvider } from '../composables/use-separator-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SeparatorRoot',
})

const props = defineProps<SeparatorRootProps>()

const separator = useSeparator(props)
SeparatorProvider(separator)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="separator.getRootProps(props.orientation)" :as-child="props.asChild">
    <slot />
  </ui.div>
</template>

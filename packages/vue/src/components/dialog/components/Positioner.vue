<script lang="ts">

import type { PolymorphicProps } from '~/factory'

export interface DialogPositionerProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { PresenceProvider, usePresence } from '~/components/presence'
import { computed } from 'vue'
import { useDialogContext } from '../composables/use-dialog-context'
import { useForwardExpose } from '~/composables'
import { useRenderStrategyProps } from '~/composables'

defineOptions({
  name: 'DialogPositioner'
})

defineProps<DialogPositionerProps>()

const dialog = useDialogContext()
const renderStrategy = useRenderStrategyProps()

const presence = usePresence(
  computed(() => ({
    ...renderStrategy.value,
    present: dialog.value.open,
  })),
)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="dialog.getPositionerProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

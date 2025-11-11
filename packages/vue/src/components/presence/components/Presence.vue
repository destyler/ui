<script setup lang="ts">
import { ui } from '../../../factory'
import { usePresence } from '../composables/use-presence'
import { PresenceProvider } from '../composables/use-presence-context'
import { useForwardExpose } from '../../../composables'
import type { BooleanDefaults } from '../../../types'
import type {PresenceProps, PresenceEmits,RootProps} from '../types'

const props = withDefaults(defineProps<PresenceProps>(), {
  immediate: undefined,
  lazyMount: undefined,
  present: undefined,
  unmountOnExit: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<PresenceEmits>()

// @ts-expect-error TODO tweak EmitFn
const presence = usePresence(props, emits)
PresenceProvider(presence)

useForwardExpose()
</script>

<template>
  <ui.div
    v-if="!presence.unmounted"
    v-bind="presence.presenceProps"
    :as-child="props.asChild"
    data-scope="presence"
    data-part="root"
  >
    <slot />
  </ui.div>
</template>

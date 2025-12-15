<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSelectContext } from '../composables/use-select-context'
import { useForwardExpose } from '~/composables'
import { usePresenceContext } from '~/components/presence'
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'

defineOptions({
  name: 'SelectContent'
})

defineProps<SelectContentProps>()
const select = useSelectContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(select.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>

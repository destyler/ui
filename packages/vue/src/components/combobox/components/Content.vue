<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface ComboboxContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { useComboboxContext } from '../composables/use-combobox-context'
import { useForwardExpose } from '~/composables'
import { usePresenceContext } from '~/components/presence'
import { mergeProps } from '@destyler/vue'

defineOptions({
  name: 'ComboboxContent',
})

defineProps<ComboboxContentProps>()
const combobox = useComboboxContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(combobox.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>

<script lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import type { PolymorphicProps } from '~/factory'
import { type PresenceProps, usePresenceContext } from '~/components/presence'

export interface ColorPickerContentProps extends PresenceProps, PolymorphicProps  {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useColorPickerContext } from '../composables/use-color-picker-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'ColorPickerContent'
})

defineProps<ColorPickerContentProps>()
const colorPicker = useColorPickerContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(colorPicker.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>

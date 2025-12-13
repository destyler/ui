<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface RadioItemTextProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadioContext } from '../composables/use-radio-context'
import { useRadioItemPropsContext } from '../composables/use-radio-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioItemText'
})

defineProps<RadioItemTextProps>()
const radio = useRadioContext()
const itemProps = useRadioItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.span v-bind="radio.getItemTextProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.span>
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface RadioItemHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadioContext } from '../composables/use-radio-context'
import { useRadioItemPropsContext } from '../composables/use-radio-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioItemHiddenInput'
})

defineProps<RadioItemHiddenInputProps>()

const radio = useRadioContext()
const itemProps = useRadioItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.input v-bind="radio.getItemHiddenInputProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.input>
</template>

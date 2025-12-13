<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface RadioItemControlProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadioContext } from '../composables/use-radio-context'
import { useRadioItemPropsContext } from '../composables/use-radio-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioItemControl'
})

defineProps<RadioItemControlProps>()

const radio = useRadioContext()
const itemProps = useRadioItemPropsContext()

useForwardExpose()
</script>

<template>
  <ui.div v-bind="radio.getItemControlProps(itemProps)" :as-child="asChild">
    <slot />
  </ui.div>
</template>

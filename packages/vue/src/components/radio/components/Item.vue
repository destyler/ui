<script lang="ts">
import type { ItemProps } from '@destyler/radio'
import type { PolymorphicProps } from '~/factory'

export interface RadioItemProps extends ItemProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { computed } from 'vue'
import { useRadioContext } from '../composables/use-radio-context'
import { RadioItemProvider } from '../composables/use-radio-item-context'
import { RadioItemPropsProvider } from '../composables/use-radio-item-props-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioItem'
})

const props = defineProps<RadioItemProps>()
const radio = useRadioContext()

RadioItemPropsProvider(props)
RadioItemProvider(computed(() => radio.value.getItemState(props)))

useForwardExpose()
</script>

<template>
  <ui.label v-bind="radio.getItemProps(props)" :as-child="asChild">
    <slot />
  </ui.label>
</template>

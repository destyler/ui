<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface RadioRootProps extends RootProps, PolymorphicProps {}
export interface RadioRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useRadio } from '../composables/use-radio'
import { RadioProvider } from '../composables/use-radio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioRoot',
})

const props = withDefaults(defineProps<RadioRootProps>(), {
  disabled: undefined,
  readOnly: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<RadioRootEmits>()

const radio = useRadio(props, emits)
RadioProvider(radio)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="radio.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

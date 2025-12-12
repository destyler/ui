<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseNumberInputReturn } from '../composables/use-number-input'

interface RootProviderProps {
  value: UnwrapRef<UseNumberInputReturn>
}

export interface NumberInputRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { NumberInputProvider } from '../composables/use-number-input-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'NumberInputRootProvider',
})

const props = defineProps<NumberInputRootProviderProps>()
const numberInput = computed(() => props.value)

NumberInputProvider(numberInput)
useForwardExpose()
</script>

<template>
  <ui.div v-bind="numberInput.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

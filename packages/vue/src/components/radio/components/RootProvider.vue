<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseRadioReturn } from '../composables/use-radio'

interface RootProviderProps {
  value: UnwrapRef<UseRadioReturn>
}

export interface RadioRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { RadioProvider } from '../composables/use-radio-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'RadioRootProvider'
})

const props = defineProps<RadioRootProviderProps>()
const radio = computed(() => props.value)

RadioProvider(radio)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="radio.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SwitchHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useSwitchContext } from '../composables/use-switch-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SwitchHiddenInput',
})

defineProps<SwitchHiddenInputProps>()

const context = useSwitchContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="context.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>

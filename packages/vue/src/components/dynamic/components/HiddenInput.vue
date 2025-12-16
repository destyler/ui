<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface DynamicHiddenInputProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useDynamicContext } from '../composables/use-dynamic-context'
import { useFieldContext } from '~/components/field'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'DynamicHiddenInput'
})

defineProps<DynamicHiddenInputProps>()

const dynamic = useDynamicContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.input :aria-describedby="field?.ariaDescribedby" v-bind="dynamic.getHiddenInputProps()" :as-child="asChild">
    <slot />
  </ui.input>
</template>

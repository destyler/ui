<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface SelectHiddenSelectProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { useFieldContext } from '~/components/field'
import { useSelectContext } from '../composables/use-select-context'

defineOptions({
  name: 'SelectHiddenSelect'
})

defineProps<SelectHiddenSelectProps>()

const select = useSelectContext()
const field = useFieldContext()

useForwardExpose()
</script>

<template>
  <ui.select :aria-describedby="field?.ariaDescribedby" v-bind="select.getHiddenSelectProps()">
    <option v-if="select.value.length === 0" value="" />
    <option
      v-for="item in select.collection.items"
      :key="item.value"
      :value="select.collection.getItemValue(item)"
      :disabled="select.collection.getItemDisabled(item)"
    >
      {{ select.collection.stringifyItem(item) }}
      >
    </option>
  </ui.select>
</template>

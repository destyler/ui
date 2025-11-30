<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { PolymorphicProps } from '~/factory'
import type { GroupEmits, GroupProps } from '../types'

export interface CheckboxGroupProps extends GroupProps, PolymorphicProps {}
export interface CheckboxGroupEmits extends GroupEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { checkboxAnatomy } from '../anatomy'
import { useCheckboxGroup } from '../composables/use-checkbox-group'
import { CheckboxGroupProvider } from '../composables/use-checkbox-group-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'CheckboxGroup'
})

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  disabled: undefined,
  readOnly: undefined,
  invalid: undefined,
} satisfies BooleanDefaults<GroupProps>)

const emits = defineEmits<CheckboxGroupEmits>()

const checkboxGroup = useCheckboxGroup(props, emits)
CheckboxGroupProvider(checkboxGroup)

useForwardExpose()
</script>

<template>
  <ui.div role="group" v-bind="{ ...checkboxAnatomy.build().group.attrs }" :as-child="asChild">
    <slot />
  </ui.div>
</template>

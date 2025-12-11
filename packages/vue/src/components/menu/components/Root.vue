<script lang="ts">
import type { BooleanDefaults } from '~/types'
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface MenuRootProps extends RootProps, RenderStrategyProps, PolymorphicProps {}
export interface MenuRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { useMenu } from '../composables/use-menu'
import { MenuProvider, useMenuContext } from '../composables/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../composables/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../composables/use-menu-trigger-item-context'

defineOptions({
  name: 'MenuRoot'
})

const props = withDefaults(defineProps<MenuRootProps>(), {
  closeOnSelect: undefined,
  composite: undefined,
  defaultOpen: undefined,
  loopFocus: undefined,
  open: undefined,
  typeahead: undefined,
} satisfies BooleanDefaults<RootProps>)

const emits = defineEmits<MenuRootEmits>()

const { api, machine } = useMenu(props, emits)

const parentApi = useMenuContext()
const parentMachine = useMenuMachineContext()

onMounted(() => {
  if (!parentMachine) return
  parentApi.value.setChild(machine)
  api.value.setParent(parentMachine)
})

MenuTriggerItemProvider(computed(() => parentApi.value.getTriggerItemProps(api.value)))
MenuMachineProvider(machine)
MenuProvider(api)
RenderStrategyPropsProvider(computed(() => ({ lazyMount: props.lazyMount, unmountOnExit: props.unmountOnExit })))

useForwardExpose()
</script>

<template>
  <slot />
</template>

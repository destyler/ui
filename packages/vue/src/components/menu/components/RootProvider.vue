<script lang="ts">
import type { RenderStrategyProps } from '~/composables'
import type { PolymorphicProps } from '~/factory'
import type { UseMenuReturn } from '../composables/use-menu'

interface RootProviderProps {
  value: UseMenuReturn
}

export interface MenuRootProviderProps extends RootProviderProps, RenderStrategyProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RenderStrategyPropsProvider, useForwardExpose } from '~/composables'
import { MenuProvider, useMenuContext } from '../composables/use-menu-context'
import { MenuMachineProvider, useMenuMachineContext } from '../composables/use-menu-machine-context'
import { MenuTriggerItemProvider } from '../composables/use-menu-trigger-item-context'

defineOptions({
  name: 'MenuRootProvider'
})

const props = defineProps<MenuRootProviderProps>()
const {
  value: { machine, api },
} = props

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

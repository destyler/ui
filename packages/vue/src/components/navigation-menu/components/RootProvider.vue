<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { UseNavigationMenuReturn } from '../composables/use-navigation-menu'

interface RootProviderProps {
  value: UseNavigationMenuReturn
}

export interface NavigationMenuRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { useForwardExpose } from '~/composables'
import { NavigationMenuProvider } from '../composables/use-navigation-menu-context'

defineOptions({
  name: 'NavigationMenuRootProvider',
})

const props = defineProps<NavigationMenuRootProviderProps>()
const {
  value: { api },
} = props

NavigationMenuProvider(api)

useForwardExpose()
</script>

<template>
  <slot />
</template>

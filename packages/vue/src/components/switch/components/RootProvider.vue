<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseSwitchReturn } from '../composables/use-switch'

interface RootProviderProps {
  value: UnwrapRef<UseSwitchReturn>
}

export interface SwitchRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { ui } from '~/factory'
import { SwitchProvider } from '../composables/use-switch-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'SwitchRootProvider',
})

const props = defineProps<SwitchRootProviderProps>()
const api = computed(() => props.value)

SwitchProvider(api)

useForwardExpose()
</script>

<template>
  <ui.label v-bind="api.getRootProps()" :as-child="asChild">
    <slot />
  </ui.label>
</template>

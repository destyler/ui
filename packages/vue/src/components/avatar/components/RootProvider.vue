<script lang="ts">
import type { UnwrapRef } from 'vue'
import type { PolymorphicProps } from '~/factory'
import type { UseAvatarReturn } from '../composables/use-avatar'

interface RootProviderProps {
  value: UnwrapRef<UseAvatarReturn>
}

export interface AvatarRootProviderProps extends RootProviderProps, PolymorphicProps {}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useForwardExpose } from '~/composables'
import { ui } from '~/factory'
import { AvatarProvider } from '../composables/use-avatar-context'

defineOptions({
  name: 'AvatarRootProvider'
})

const props = defineProps<AvatarRootProviderProps>()
const avatar = computed(() => props.value)

AvatarProvider(avatar)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="avatar.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

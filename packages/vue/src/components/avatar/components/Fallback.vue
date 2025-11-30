<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface AvatarFallbackProps extends PolymorphicProps{}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'
import { useAvatarContext } from '../composables/use-avatar-context'

defineOptions({
  name: 'AvatarFallback'
})

defineProps<AvatarFallbackProps>()
const avatar = useAvatarContext()
useForwardExpose()
</script>

<template>
  <ui.span v-bind="avatar.getFallbackProps()" :as-child="asChild">
    <slot />
  </ui.span>
</template>

<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import type { RootEmits, RootProps } from '../types'

export interface AvatarRootProps extends RootProps, PolymorphicProps{}
export interface AvatarRootEmits extends RootEmits {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useAvatar } from '../composables/use-avatar'
import { AvatarProvider } from '../composables/use-avatar-context'
import { useForwardExpose } from '~/composables'

const props = defineProps<AvatarRootProps>()
const emits = defineEmits<AvatarRootEmits>()

const avatar = useAvatar(props, emits)
AvatarProvider(avatar)

useForwardExpose()
</script>

<template>
  <ui.div v-bind="avatar.getRootProps()" :as-child="asChild">
    <slot />
  </ui.div>
</template>

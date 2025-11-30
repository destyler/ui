<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface AvatarImageProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useForwardExpose } from '~/composables'
import { useAvatarContext } from '../composables/use-avatar-context'

defineOptions({
  name: 'AvatarImage'
})

defineProps<AvatarImageProps>()
const avatar = useAvatarContext()

useForwardExpose()
</script>

<template>
  <ui.img v-bind="avatar.getImageProps()" :as-child="asChild" />
</template>

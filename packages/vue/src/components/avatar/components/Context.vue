<script lang="ts">
import type { SlotsType, UnwrapRef } from 'vue'
import type { UseAvatarContext } from '../composables/use-avatar-context'

export interface AvatarContextProps
  extends SlotsType<{
    default: UnwrapRef<UseAvatarContext>
  }> {}
</script>

<script setup lang="ts">
import { useAvatarContext } from '../composables/use-avatar-context'

const avatar = useAvatarContext()

defineSlots<{
  default(avatar: UnwrapRef<UseAvatarContext>): unknown
}>()
</script>

<template>
  <slot v-bind="avatar"></slot>
</template>

<script setup lang="ts">
import type { AvatarRootEmits, AvatarRootProps } from '../../../index'
import { Avatar, useForwardPropsEmits } from '../../../index'
import { computed } from 'vue'

export interface AvatarProps extends AvatarRootProps {
  src?: string
  name: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  name: 'Elone Hoo',
  src: 'https://github.com/elonehoo.png',
})
const emits = defineEmits<AvatarRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)

const getInitials = computed(() =>
  props.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)
</script>

<template>
  <Avatar.Root v-bind="forwarded">
    <Avatar.Fallback>{{ getInitials }}</Avatar.Fallback>
    <Avatar.Image :src="props.src" :alt="props.name" />
  </Avatar.Root>
</template>

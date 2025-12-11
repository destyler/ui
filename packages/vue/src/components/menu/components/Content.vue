<script lang="ts">
import type { PolymorphicProps } from '~/factory'
import { usePresenceContext } from '~/components/presence'

export interface MenuContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { ui } from '~/factory'
import { useMenuContext } from '../composables/use-menu-context'
import { useForwardExpose } from '~/composables'

defineOptions({
  name: 'MenuContent'
})

defineProps<MenuContentProps>()

const menu = useMenuContext()
const presence = usePresenceContext()

const mergedProps = computed(() => mergeProps(menu.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>

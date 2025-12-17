<script lang="ts">
import type { PolymorphicProps } from '~/factory'

export interface TourContentProps extends PolymorphicProps {}
</script>

<script setup lang="ts">
import { ui } from '~/factory'
import { useTourContext } from '../composables/use-tour-context'
import { useForwardExpose } from '~/composables'
import { mergeProps } from '@destyler/vue'
import { computed } from 'vue'
import { usePresenceContext } from '~/components/presence'

defineOptions({
  name: 'TourContent'
})

defineProps<TourContentProps>()

const tour = useTourContext()
const presence = usePresenceContext()
const mergedProps = computed(() => mergeProps(tour.value.getContentProps(), presence.value.presenceProps))

useForwardExpose()
</script>

<template>
  <ui.div v-if="!presence.unmounted" v-bind="mergedProps" :as-child="asChild">
    <slot />
  </ui.div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Tour, useTour } from '../index'
import type { StepDetails } from '@destyler/tour'

const targetRef = ref<HTMLElement | null>(null)

const steps: StepDetails[] = [
  {
    id: 'step-1',
    type: 'tooltip',
    title: 'Welcome',
    description: 'Welcome to the tour!',
    target: () => targetRef.value,
    arrow: true,
    backdrop: true,
  },
]

const tour = useTour({ steps })

onMounted(() => {
  tour.value.start()
})
</script>

<template>
  <main>
    <button ref="targetRef">
      Target
    </button>

    <Tour.Root :tour="tour">
      <Tour.Backdrop />
      <Tour.Spotlight />
      <Tour.Positioner>
        <Tour.Content>
          <Tour.Arrow>
            <Tour.ArrowTip />
          </Tour.Arrow>
          <Tour.Title />
          <Tour.Description />
          <Tour.ProgressText />
          <Tour.Control>
            <Tour.ActionTrigger action="prev">Prev</Tour.ActionTrigger>
            <Tour.ActionTrigger action="next">Next</Tour.ActionTrigger>
          </Tour.Control>
          <Tour.CloseTrigger>X</Tour.CloseTrigger>
        </Tour.Content>
      </Tour.Positioner>
    </Tour.Root>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Carousel } from '../index'

const props = defineProps<{ onRequest: (page: number) => void, onConsumerEvent: (type: string) => void }>()
const page = ref(0)
const pending = ref(0)
const dragStarts = ref(0)
const accept = ref(false)
const cancel = ref(false)
const mounted = ref(true)
const updated = ref(false)
function request(details: { page: number }) {
  pending.value = details.page
  props.onRequest(details.page)
  if (accept.value)
    page.value = details.page
}
const prevent = computed(() => {
  const prefix = updated.value ? 'updated:' : ''
  return (event: Event) => {
    props.onConsumerEvent(prefix + event.type)
    if (cancel.value)
      event.preventDefault()
  }
})
</script>

<template>
  <output data-testid="drag-start-count">{{ dragStarts }}</output>
  <output data-testid="parent-page">{{ page }}</output>
  <button data-testid="accept-pending" @click="page = pending">Accept pending</button>
  <button data-testid="parent-zero" @click="page = 0">Parent zero</button>
  <button data-testid="toggle-accept" @click="accept = !accept">Toggle acceptance</button>
  <button data-testid="toggle-cancel" @click="cancel = !cancel">Toggle cancellation</button>
  <button data-testid="update-handlers" @click="updated = !updated">Update handlers</button>
  <button data-testid="toggle-mounted" @click="mounted = !mounted">Toggle mount</button>
  <Carousel.Root v-if="mounted" :page="page" :slide-count="3" allow-mouse-drag @drag-status-change="details => { if (details.type === 'dragging.start') dragStarts++ }" style="width: 300px" @page-change="request">
    <Carousel.Context v-slot="api">
      <output data-testid="api-page">{{ api.page }}</output>
      <output data-testid="snap-count">{{ api.pageSnapPoints.length }}</output>
      <output data-testid="playing">{{ String(api.isPlaying) }}</output>
    </Carousel.Context>
    <Carousel.PrevTrigger data-testid="previous" @click="prevent">Previous</Carousel.PrevTrigger>
    <Carousel.NextTrigger data-testid="next" @click="prevent">Next</Carousel.NextTrigger>
    <Carousel.AutoplayTrigger data-testid="autoplay" @click="prevent">Autoplay</Carousel.AutoplayTrigger>
    <Carousel.IndicatorGroup @keydown="prevent">
      <Carousel.Indicator :index="0" data-testid="indicator-zero" @click="prevent">First</Carousel.Indicator>
      <Carousel.Indicator :index="2" data-testid="indicator-two" @click="prevent">Third</Carousel.Indicator>
      <Carousel.Indicator :index="1" data-testid="readonly-indicator" read-only>Readonly</Carousel.Indicator>
    </Carousel.IndicatorGroup>
    <Carousel.ItemGroup data-testid="item-group" @mousedown="prevent" style="height: 80px">
      <Carousel.Item v-for="index in [0, 1, 2]" :key="index" :index="index">Slide {{ index }}</Carousel.Item>
    </Carousel.ItemGroup>
  </Carousel.Root>
</template>

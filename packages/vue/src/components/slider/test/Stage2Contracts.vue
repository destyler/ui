<script setup lang="ts">
import type { ValueChangeDetails } from '@destyler/slider'
import { ref } from 'vue'
import { Slider } from '../index'

const props = defineProps<{ mode?: 'accept' | 'veto' | 'delay', onValueChange?: (details: ValueChangeDetails) => void }>()
const value = ref([20, 80])
const pending = ref<number[]>([])
function change(details: ValueChangeDetails) {
  pending.value = details.value
  props.onValueChange?.(details)
  if ((props.mode ?? 'accept') === 'accept') value.value = details.value
}
</script>

<template>
  <form data-testid="slider-form">
    <Slider.Root id="stage2-slider" :model-value="value" thumb-alignment="center" @value-change="change">
      <Slider.Label>Range</Slider.Label>
      <Slider.ValueText data-testid="values" />
      <Slider.Control>
        <Slider.Track><Slider.Range /></Slider.Track>
        <Slider.Thumb :index="0" name="low"><Slider.HiddenInput /></Slider.Thumb>
        <Slider.Thumb :index="1" name="high"><Slider.HiddenInput /></Slider.Thumb>
      </Slider.Control>
    </Slider.Root>
    <button type="button" @click="value = pending">Accept pending</button>
  </form>
</template>

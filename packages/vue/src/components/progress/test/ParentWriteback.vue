<script setup lang="ts">
import type { ValueChangeDetails } from '@destyler/progress'
import { ref } from 'vue'
import { Progress } from '../index'

const value = ref<number | null>(42)
const changes = ref<ValueChangeDetails[]>([])
</script>

<template>
  <output data-testid="parent-value">{{ value === null ? 'null' : value }}</output>
  <output data-testid="change-events">{{ JSON.stringify(changes) }}</output>
  <button type="button" data-action="parent" @click="value = 80">parent-set</button>
  <Progress.Root v-model="value" @value-change="changes.push($event)">
    <Progress.ValueText />
    <Progress.Track><Progress.Range /></Progress.Track>
    <Progress.Context v-slot="api">
      <button type="button" data-action="set" @click="api.setValue(65)">set-value</button>
      <button type="button" data-action="zero" @click="api.setValue(0)">set-zero</button>
      <button type="button" data-action="null" @click="api.setValue(null)">set-null</button>
      <button type="button" data-action="same" @click="api.setValue(api.value)">set-current</button>
    </Progress.Context>
  </Progress.Root>
</template>

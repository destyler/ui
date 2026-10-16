<script setup lang="ts">
import { ref } from 'vue'
import { Tabs } from '../index'
import ClearNotificationControls from './ClearNotificationControls.vue'

const props = defineProps<{
  mode: 'accept' | 'veto' | 'delay' | 'binding' | 'uncontrolled'
  onChange: (details: { value: string | null }) => void
  onModelUpdate: (value: string | null) => void
}>()
const value = ref<string | null>('alpha')
const pending = ref<string | null | undefined>(undefined)

function handleChange(details: { value: string | null }) {
  props.onChange(details)
  if (props.mode === 'accept') value.value = details.value
  if (props.mode === 'delay') pending.value = details.value
}

function acceptPending() {
  if (pending.value !== undefined) value.value = pending.value
}
</script>

<template>
  <button data-action="parent-clear" @click="value = null">Parent clear</button>
  <button data-action="parent-restore" @click="value = 'alpha'">Parent restore</button>
  <button data-action="parent-accept" @click="acceptPending">Accept pending</button>
  <output data-value="parent">{{ value ?? 'none' }}</output>
  <Tabs.Root
    v-if="mode === 'binding'"
    v-model="value"
    deselectable
    activation-mode="manual"
    @value-change="handleChange"
    @update:model-value="props.onModelUpdate"
  >
    <ClearNotificationControls />
  </Tabs.Root>
  <Tabs.Root
    v-else
    :model-value="mode === 'uncontrolled' ? undefined : value"
    default-value="alpha"
    deselectable
    activation-mode="manual"
    @value-change="handleChange"
    @update:model-value="props.onModelUpdate"
  >
    <ClearNotificationControls />
  </Tabs.Root>
</template>

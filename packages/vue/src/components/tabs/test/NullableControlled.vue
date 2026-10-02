<script setup lang="ts">
import { ref } from 'vue'
import { Tabs } from '../index'
const props = defineProps<{ initial: string | null, onChange: (value: string | null) => void }>()
const value = ref<string | null>(props.initial)
</script>

<template>
  <button @click="value = null">Parent clear</button>
  <button @click="value = 'alpha'">Parent restore</button>
  <output>{{ value ?? 'none' }}</output>
  <Tabs.Root v-model="value" @value-change="details => props.onChange(details.value)">
    <Tabs.List><Tabs.Trigger value="alpha">Alpha</Tabs.Trigger><Tabs.Trigger value="beta">Beta</Tabs.Trigger></Tabs.List>
    <Tabs.Content value="alpha">Alpha content</Tabs.Content><Tabs.Content value="beta">Beta content</Tabs.Content>
  </Tabs.Root>
</template>

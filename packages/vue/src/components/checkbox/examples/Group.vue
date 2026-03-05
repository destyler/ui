<script setup lang="ts">
import { Checkbox } from '../index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]
</script>

<template>
  <Checkbox.Group :defaultValue="['react']" name="framework" @valueChange="console.log">
    <Checkbox.Root v-for="item in items" :value="item.value" :key="item.value">
      <Checkbox.Control>
        <Checkbox.Indicator>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{{ item.label }}</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  </Checkbox.Group>
</template>

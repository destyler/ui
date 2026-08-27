<script setup lang="ts">
import { Checkbox } from '../index'
import { computed, ref } from 'vue'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]

const value = ref<string[]>([])

const allSelected = computed(() => value.value.length === items.length)
const indeterminate = computed(() => value.value.length > 0 && value.value.length < items.length)

function handleSelectAll(checked: boolean) {
  value.value = checked ? items.map(item => item.value) : []
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 10px;">
    <Checkbox.Root value="all" :checked="indeterminate ? 'indeterminate' : allSelected" @checkedChange="handleSelectAll(!!$event.checked)">
      <Checkbox.Control>
        <Checkbox.Indicator>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </Checkbox.Indicator>
        <Checkbox.Indicator indeterminate>
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="12" height="12">
            <path d="M3 7H11" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>Select All</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>

    <Checkbox.Group v-model="value" name="framework">
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

    <pre>Selected: {{ JSON.stringify(value) }}</pre>
  </div>
</template>

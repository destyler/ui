<script setup lang="ts">
import { Checkbox } from '~/index'

const items = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
]
</script>

<template>
  <Checkbox.Group :defaultValue="['react']" name="framework" @valueChange="console.log">
    <Checkbox.Root v-for="item in items" :value="item.value" :key="item.value">
      <Checkbox.Label>{{ item.label }}</Checkbox.Label>
      <Checkbox.Control>
        <Checkbox.Indicator>
          x
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  </Checkbox.Group>
</template>

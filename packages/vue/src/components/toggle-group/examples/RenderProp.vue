<script setup lang="ts">
import { ToggleGroup } from '../index'
</script>

<template>
  <ToggleGroup.Root>
    <ToggleGroup.Context v-slot="{ value }">
      <span>Selected: {{ value.join(', ') || 'None' }}</span>
    </ToggleGroup.Context>
    <ToggleGroup.Item value="a">A</ToggleGroup.Item>
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="c">C</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>

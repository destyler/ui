<script setup lang="ts">
import { ToggleGroup } from '../index'
</script>

<template>
 <ToggleGroup.Root :default-value="['a']">
    <ToggleGroup.Item value="a">A</ToggleGroup.Item>
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="c">C</ToggleGroup.Item>
  </ToggleGroup.Root>
</template>

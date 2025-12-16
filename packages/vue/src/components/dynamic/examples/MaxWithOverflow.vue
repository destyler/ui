<script setup lang="ts">
import { Dynamic } from '../index'
</script>

<template>
  <Dynamic.Root :max="3" allowOverflow>
    <Dynamic.Context v-slot="tagsInput">
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        <Dynamic.Item v-for="(value, index) in tagsInput.value" :key="index" :index="index" :value="value">
          <Dynamic.ItemInput />
          <Dynamic.ItemText>{{ value }}</Dynamic.ItemText>
          <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
        </Dynamic.Item>
        <Dynamic.Input placeholder="Add Framework" />
        <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
      </Dynamic.Control>
    </Dynamic.Context>
    <Dynamic.HiddenInput />
  </Dynamic.Root>
</template>

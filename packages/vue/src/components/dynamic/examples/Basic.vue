<script setup lang="ts">
import { ref } from 'vue'
import { Dynamic } from '../index'

const frameworks = ref(['react', 'solid', 'vue'])
</script>

<template>
  <Dynamic.Root v-model="frameworks">
    <Dynamic.Context v-slot="tagsInput">
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        <Dynamic.Item v-for="(value, index) in tagsInput.value" :key="index" :index="index" :value="value">
          <Dynamic.ItemPreview>
            <Dynamic.ItemText>{{ value }}</Dynamic.ItemText>
            <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
          </Dynamic.ItemPreview>
          <Dynamic.ItemInput />
        </Dynamic.Item>
        <Dynamic.Input placeholder="Add tag" />
        <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
      </Dynamic.Control>
    </Dynamic.Context>
    <Dynamic.HiddenInput />
  </Dynamic.Root>
</template>

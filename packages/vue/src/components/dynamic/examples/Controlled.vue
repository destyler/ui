<script setup lang="ts">
import { Dynamic } from '../index'
import { ref } from 'vue'

const value = ref(['react', 'solid', 'vue'])
</script>

<template>
  <output>{{ value.join(', ') }}</output>
  <Dynamic.Root v-model="value">
    <Dynamic.Context v-slot="tagsInput">
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        <Dynamic.Item v-for="(item, index) in tagsInput.value" :key="index" :index="index" :value="item">
          <Dynamic.ItemPreview>
            <Dynamic.ItemText>{{ item }}</Dynamic.ItemText>
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

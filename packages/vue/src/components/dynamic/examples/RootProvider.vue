<script setup lang="ts">
import { Dynamic, useDynamic } from '../index'

const dynamic = useDynamic()
</script>

<template>
  <button @click="dynamic.focus()">Focus</button>

  <Dynamic.RootProvider :value="dynamic">
    <Dynamic.Context v-slot="dynamic">
      <Dynamic.Label>Frameworks</Dynamic.Label>
      <Dynamic.Control>
        <Dynamic.Item v-for="(value, index) in dynamic.value" :key="index" :index="index" :value="value">
          <Dynamic.ItemPreview>
            <Dynamic.ItemText>{{ value }}</Dynamic.ItemText>
            <Dynamic.ItemDeleteTrigger>Delete</Dynamic.ItemDeleteTrigger>
          </Dynamic.ItemPreview>
          <Dynamic.ItemInput />
        </Dynamic.Item>
        <Dynamic.Input placeholder="Add Framework" />
        <Dynamic.ClearTrigger>Clear all</Dynamic.ClearTrigger>
      </Dynamic.Control>
    </Dynamic.Context>
    <Dynamic.HiddenInput />
  </Dynamic.RootProvider>
</template>

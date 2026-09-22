<script setup lang="ts">
import { Progress } from '../index'
import { ref } from 'vue'

const value = ref<number | null>(42)
</script>

<template>
  <button type="button" @click="value = 80">
    parent-set-80
  </button>
  <Progress.Root v-model="value">
    <Progress.Label>Label</Progress.Label>
    <Progress.ValueText />
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
    <Progress.Context v-slot="api">
      <button type="button" @click="api.setValue(65)">
        api-set-65
      </button>
    </Progress.Context>
  </Progress.Root>
</template>

<script setup lang="ts">
import { Progress, useProgress } from '../../index'

const progress = useProgress()
</script>

<template>
  <button @click="progress.setToMax()">Set to MAX</button>

  <Progress.Root>
    <Progress.Label>Label</Progress.Label>
    <Progress.ValueText />
    <Progress.Circle>
      <Progress.CircleTrack />
      <Progress.CircleRange />
    </Progress.Circle>
  </Progress.Root>
</template>

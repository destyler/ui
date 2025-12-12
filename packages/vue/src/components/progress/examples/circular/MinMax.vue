<script setup lang="ts">
import { Progress } from '../../index'
</script>

<template>
  <Progress.Root :defaultValue="20" :min="10" :max="30">
    <Progress.Label>Label</Progress.Label>
    <Progress.ValueText />
    <Progress.Circle>
      <Progress.CircleTrack />
      <Progress.CircleRange />
    </Progress.Circle>
  </Progress.Root>
</template>

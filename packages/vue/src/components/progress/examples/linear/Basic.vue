<script setup lang="ts">
import { Progress } from '../../index'
</script>

<template>
  <Progress.Root :defaultValue="42">
    <Progress.Label>Label</Progress.Label>
    <Progress.ValueText />
    <Progress.Track>
      <Progress.Range />
    </Progress.Track>
  </Progress.Root>
</template>

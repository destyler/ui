<script setup lang="ts">
import { Switch } from '../index'
</script>

<template>
  <Switch.Root disabled>
    <Switch.Control>
      <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>Label</Switch.Label>
    <Switch.HiddenInput />
  </Switch.Root>
</template>

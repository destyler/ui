<script setup lang="ts">
import { Toggle } from '../index'
</script>

<template>
 <Toggle.Root :default-pressed="true">
    <Toggle.Indicator>
      ✓
    </Toggle.Indicator>
    Toggle
  </Toggle.Root>
</template>

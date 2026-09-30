<script setup lang="ts">
import { Tooltip } from '../index'
</script>
<template>
 <Tooltip.Root default-open :open-delay="0" :close-delay="0">
    <Tooltip.Trigger>hover me</Tooltip.Trigger>
    <Tooltip.Positioner>
      <Tooltip.Arrow>
        <Tooltip.ArrowTip />
      </Tooltip.Arrow>
      <Tooltip.Content>content</Tooltip.Content>
    </Tooltip.Positioner>
  </Tooltip.Root>
</template>

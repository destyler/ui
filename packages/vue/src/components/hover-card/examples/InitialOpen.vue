<script setup lang="ts">
import { HoverCard } from '../index'
</script>

<template>
 <HoverCard.Root default-open :open-delay="0" :close-delay="0">
    <HoverCard.Trigger>Hover me</HoverCard.Trigger>
    <Teleport to="body">
      <HoverCard.Positioner data-testid="positioner">
        <HoverCard.Content>
          <HoverCard.Arrow>
            <HoverCard.ArrowTip />
          </HoverCard.Arrow>
          Content
        </HoverCard.Content>
      </HoverCard.Positioner>
    </Teleport>
  </HoverCard.Root>
</template>

<script setup lang="ts">
import CalendarExample from '../components/calendar/examples/Standalone.vue'
import { Dialog } from '../components/dialog'
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Open calendar dialog</Dialog.Trigger>
    <Teleport to="body">
      <Dialog.Positioner>
        <Dialog.Content>
          <Dialog.Title>Calendar dialog</Dialog.Title>
          <Dialog.Description>Choose a date</Dialog.Description>
          <CalendarExample />
        </Dialog.Content>
      </Dialog.Positioner>
    </Teleport>
  </Dialog.Root>
</template>

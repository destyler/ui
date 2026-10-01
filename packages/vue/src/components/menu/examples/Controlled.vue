<script setup lang="ts">
import type { InteractOutsideEvent } from '@destyler/menu'
import { Menu } from '../index'
import { ref } from 'vue'

const isOpen = ref(false)
const externalTrigger = ref<HTMLButtonElement | null>(null)

function handleInteractOutside(event: InteractOutsideEvent) {
  const target = event.detail.originalEvent.target
  // The external button owns this toggle. Dismissing on its pointerdown or
  // focus would set false before click toggles the value back to true.
  if (target instanceof Node && externalTrigger.value?.contains(target))
    event.preventDefault()
}
</script>

<template>
  <button ref="externalTrigger" @click="isOpen = !isOpen">Trigger from the outside</button>
  <Menu.Root v-model:open="isOpen" @interact-outside="handleInteractOutside">
    <Menu.Trigger>Open menu</Menu.Trigger>
    <Menu.Positioner>
      <Menu.Content>
        <Menu.Item value="react">React</Menu.Item>
        <Menu.Item value="solid">Solid</Menu.Item>
        <Menu.Item value="vue">Vue</Menu.Item>
      </Menu.Content>
    </Menu.Positioner>
  </Menu.Root>
</template>

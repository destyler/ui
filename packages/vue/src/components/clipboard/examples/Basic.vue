<script setup lang="ts">
import { Clipboard } from '../index'
</script>

<template>
  <Clipboard.Root value="https.//destyler.org">
    <Clipboard.Label>Copy this link</Clipboard.Label>
    <Clipboard.Control>
      <Clipboard.Input />
      <Clipboard.Trigger>
        <Clipboard.Indicator>
          x
          <template #copied>
            y
          </template>
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Control>
  </Clipboard.Root>
</template>

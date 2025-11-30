<script setup lang="ts">
import { Clipboard, useClipboard } from '../'

const clipboard = useClipboard({ value: 'https.//destyler.org' })
</script>

<template>
  <button @click="clipboard.copy()">Copy</button>

  <Clipboard.RootProvider :value="clipboard">
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
  </Clipboard.RootProvider>
</template>

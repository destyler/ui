<script setup lang="ts">
import { Clipboard, useClipboard } from '../index'

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
          <span class="i-tabler-copy" />
          <template #copied>
            <span class="i-tabler-check" />
          </template>
        </Clipboard.Indicator>
      </Clipboard.Trigger>
    </Clipboard.Control>
  </Clipboard.RootProvider>
</template>

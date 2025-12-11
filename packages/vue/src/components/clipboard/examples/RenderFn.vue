<script setup lang="ts">
import { Clipboard } from '~/index'
</script>

<template>
  <Clipboard.Root value="https.//destyler.org">
    <Clipboard.Label>Copy this link</Clipboard.Label>
    <Clipboard.Control>
      <Clipboard.Input />
      <Clipboard.Trigger>
        <Clipboard.Context v-slot="{ copied }">
          <span v-if="copied" >x</span>
          <span v-else >y</span>
        </Clipboard.Context>
      </Clipboard.Trigger>
    </Clipboard.Control>
  </Clipboard.Root>
</template>

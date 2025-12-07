<script setup lang="ts">
import { ClientOnly } from '~/providers/client-only'
</script>

<template>
  <ClientOnly>
    <div data-testid="client-slot">Client content</div>
    <template #fallback>
      <div data-testid="fallback-slot">Fallback content</div>
    </template>
  </ClientOnly>
</template>

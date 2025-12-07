<script setup lang="ts">
import { createContext } from '~/utils/create-context'

const [, consumer] = createContext<string>('test-context')

const injectedValue = consumer('fallback-value')
</script>

<template>
  <div data-testid="consumer">
    {{ injectedValue }}
  </div>
</template>

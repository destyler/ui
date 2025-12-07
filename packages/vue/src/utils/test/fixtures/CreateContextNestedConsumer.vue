<script setup lang="ts">
import { testContextConsumer } from './test-context'

const injectedValue = testContextConsumer()
</script>

<template>
  <div data-testid="nested-consumer">
    {{ injectedValue }}
  </div>
</template>

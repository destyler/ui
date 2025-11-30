<script setup lang="ts">
import { computed } from 'vue'
import { testContextConsumer } from './test-context'

interface TestContext {
  name: string
  count: number
}

const injectedValue = testContextConsumer()

const displayValue = computed(() => {
  if (typeof injectedValue === 'object' && injectedValue !== null) {
    return `${(injectedValue as TestContext).name} - ${(injectedValue as TestContext).count}`
  }
  return injectedValue
})
</script>

<template>
  <div data-testid="consumer">
    {{ displayValue }}
  </div>
</template>

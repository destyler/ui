<script setup lang="ts">
import { testContextProvider } from './test-context'
import CreateContextConsumer from './CreateContextConsumer.vue'
import CreateContextNested from './CreateContextNested.vue'

interface TestContext {
  name: string
  count: number
}

const props = defineProps<{
  value: string | TestContext
  nested?: boolean
  nestedValue?: string
}>()

testContextProvider(props.value)
</script>

<template>
  <div>
    <template v-if="nested">
      <CreateContextConsumer />
      <CreateContextNested v-if="nestedValue" :value="nestedValue" />
    </template>
    <template v-else>
      <CreateContextConsumer />
    </template>
  </div>
</template>

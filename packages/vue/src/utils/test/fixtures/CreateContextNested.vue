<script setup lang="ts">
import { testContextProvider } from './test-context'
import CreateContextNestedConsumer from './CreateContextNestedConsumer.vue'

const props = defineProps<{
  value: string
}>()

testContextProvider(props.value)
</script>

<template>
  <CreateContextNestedConsumer />
</template>

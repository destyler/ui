<script setup lang="ts">
import { useEnvironmentContext } from '../index'

const environment = useEnvironmentContext()
</script>

<template>
  <pre>{{ JSON.stringify(environment?.getRootNode(), null, 2) }}</pre>
</template>

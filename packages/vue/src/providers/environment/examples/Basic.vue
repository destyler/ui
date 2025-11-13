<script setup lang="ts">
import { EnvironmentProvider } from '../index'
import Usage from './Usage.vue'
</script>

<template>
  <EnvironmentProvider>
    <Usage />
  </EnvironmentProvider>
</template>

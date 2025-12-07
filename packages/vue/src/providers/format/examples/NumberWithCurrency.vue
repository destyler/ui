<script setup lang="ts">
import { Format } from '../index'
</script>

<template>
  <Format.Number :value="1234.45" format-style="currency" currency="USD" />
</template>

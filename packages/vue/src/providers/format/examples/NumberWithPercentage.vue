<script setup lang="ts">
import { Format } from '../index'
</script>

<template>
  <Format.Number :value="0.145" format-style="percent" :maximum-fraction-digits="2" :minimum-fraction-digits="2" />
</template>

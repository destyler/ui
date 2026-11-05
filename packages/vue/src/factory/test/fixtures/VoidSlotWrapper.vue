<script setup lang="ts">
import { ui } from '~/factory'

defineProps<{ tag: 'input' | 'hr' }>()
</script>

<template>
  <ui.input v-if="tag === 'input'"><slot /></ui.input>
  <ui.hr v-else><slot /></ui.hr>
</template>

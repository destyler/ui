<script setup lang="ts">
import { QrCode } from '../index'

const props = defineProps<{
  defaultValue?: string
  modelValue?: string
  ids?: { root?: string }
}>()
</script>

<template>
  <QrCode.Root v-bind="props">
    <QrCode.Context v-slot="api">
      <output data-testid="value">{{ api.value }}</output>
      <button type="button" @click="api.setValue('https://updated.example')">Set value</button>
    </QrCode.Context>
    <QrCode.Frame><QrCode.Pattern data-testid="pattern" /></QrCode.Frame>
  </QrCode.Root>
</template>

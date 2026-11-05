<script setup lang="ts">
import { normalizeProps } from '@destyler/vue'
import { ref } from 'vue'
import { QrCode } from '../index'

defineProps<{ modelValue: string }>()
const dataUrl = ref('')
const frameProps = normalizeProps.svg({ preserveAspectRatio: 'xMidYMid meet' })
const patternProps = normalizeProps.path({ strokeWidth: 2, fillRule: 'evenodd', clipRule: 'evenodd' })
</script>

<template>
  <QrCode.Root id="svg-contract" :model-value="modelValue">
    <QrCode.Frame v-bind="frameProps"><QrCode.Pattern v-bind="patternProps" /></QrCode.Frame>
    <QrCode.Context v-slot="api">
      <button type="button" @click="async () => { dataUrl = await api.getDataUrl('image/svg+xml') }">Export SVG</button>
    </QrCode.Context>
    <output data-testid="svg-data-url">{{ dataUrl }}</output>
  </QrCode.Root>
</template>

<script setup lang="ts">
import { QrCode } from '../index'
import { ref } from 'vue'

const encoding = ref<QrCode.GenerateOptions>({ ecc: 'H' })
</script>

<template>
  <QrCode.Root defaultValue="https://destyler.org" :encoding="encoding">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.Root>
</template>

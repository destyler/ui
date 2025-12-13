<script setup lang="ts">
import { QrCode } from '../index'
import { ref } from 'vue'

const value = ref('https://destyler.org')
</script>

<template>
  <QrCode.Root v-model="value">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">Download</QrCode.DownloadTrigger>
  </QrCode.Root>
</template>

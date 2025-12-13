<script setup lang="ts">
import { QrCode, useQrCode } from '../index'

const qrCode = useQrCode({ defaultValue: 'https://destyler.org' })
</script>

<template>
  <button @click="qrCode.setValue('https://destyler.org')">Set Value</button>

  <QrCode.RootProvider :value="qrCode">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
  </QrCode.RootProvider>
</template>

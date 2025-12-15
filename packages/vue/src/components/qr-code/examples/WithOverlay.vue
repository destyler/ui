<script setup lang="ts">
import { QrCode } from '../index'
</script>

<template>
  <QrCode.Root defaultValue="https://destyler.org">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.Overlay>
      <img src="https://destyler.org/favicon.svg" alt="Logo" />
    </QrCode.Overlay>
  </QrCode.Root>
</template>

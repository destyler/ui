<script setup lang="ts">
import { QrCode } from '../index'
</script>

<template>
  <QrCode.Root value="http://destyler.com">
    <QrCode.Frame>
      <QrCode.Pattern />
    </QrCode.Frame>
    <QrCode.Overlay>
      <img src="https://github.com/elonehoo.png" alt="" />
    </QrCode.Overlay>
    <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">Download</QrCode.DownloadTrigger>
  </QrCode.Root>
</template>

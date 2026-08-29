<script lang="ts">
  import { QrCode } from '../index'
  let value = $state('https://destyler.org')
</script>

<QrCode.Root bind:value>
  <QrCode.Frame><QrCode.Pattern /></QrCode.Frame>
  <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">Download</QrCode.DownloadTrigger>
</QrCode.Root>

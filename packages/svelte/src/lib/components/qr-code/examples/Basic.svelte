<script lang="ts">
  import { QrCode } from '../index'
</script>

<QrCode.Root value="https://destyler.com">
  <QrCode.Frame><QrCode.Pattern data-testid="pattern" /></QrCode.Frame>
  <QrCode.Overlay><img src="https://github.com/elonehoo.png" alt="" /></QrCode.Overlay>
  <QrCode.DownloadTrigger fileName="qr-code.png" mimeType="image/png">Download</QrCode.DownloadTrigger>
</QrCode.Root>

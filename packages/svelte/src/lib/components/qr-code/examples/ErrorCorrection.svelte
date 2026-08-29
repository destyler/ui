<script lang="ts">
  import { QrCode } from '../index'
  const encoding: QrCode.GenerateOptions = { ecc: 'H' }
</script>

<QrCode.Root defaultValue="https://destyler.org" {encoding}>
  <QrCode.Frame><QrCode.Pattern /></QrCode.Frame>
</QrCode.Root>

<script lang="ts">
  import { QrCode, useQrCode } from '../index'
  const id = $props.id()
  const qrCode = useQrCode({ id, defaultValue: 'https://destyler.org' })
</script>

<button type="button" onclick={() => qrCode().setValue('https://elonehoo.me')}>Set Value</button>
<QrCode.RootProvider value={qrCode}>
  <QrCode.Frame><QrCode.Pattern /></QrCode.Frame>
</QrCode.RootProvider>

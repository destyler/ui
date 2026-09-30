<script lang="ts">
  import type { UseQrCodeProps } from '../index'
  import { QrCode, useQrCode } from '../index'

  const props: Omit<UseQrCodeProps, 'id'> = $props()
  const id = $props.id()
  const qrCode = useQrCode(() => ({ id, ...props }))
</script>

<QrCode.RootProvider value={qrCode}>
  <QrCode.Frame><QrCode.Pattern data-testid="pattern" /></QrCode.Frame>
  <output data-testid="value">{JSON.stringify(qrCode().value)}</output>
  <button type="button" onclick={() => qrCode().setValue('Edited')}>Edit value</button>
  <button type="button" onclick={() => qrCode().setValue('')}>Clear value</button>
</QrCode.RootProvider>

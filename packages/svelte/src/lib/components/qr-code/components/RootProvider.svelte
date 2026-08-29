<script module lang="ts">
  import type { Assign, HTMLProps } from '$lib/types'
  import type { UseQrCodeReturn } from '../hooks/use-qr-code.svelte'

  interface RootProviderProps {
    value: UseQrCodeReturn
  }

  export interface QrCodeRootProviderBaseProps extends RootProviderProps {}
  export interface QrCodeRootProviderProps extends Assign<HTMLProps<'div'>, QrCodeRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { QrCodeProvider } from '../hooks/use-qr-code-context'

  const { value: qrCode, ...localProps }: QrCodeRootProviderProps = $props()
  const mergedProps = $derived(mergeProps(qrCode().getRootProps(), localProps))

  QrCodeProvider(() => qrCode())
</script>

<UI as="div" {...mergedProps} />

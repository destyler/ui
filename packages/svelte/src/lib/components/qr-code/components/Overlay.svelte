<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface QrCodeOverlayBaseProps extends PolymorphicProps<'div'> {}
  export interface QrCodeOverlayProps extends Assign<HTMLProps<'div'>, QrCodeOverlayBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useQrCodeContext } from '../hooks/use-qr-code-context'

  const props: QrCodeOverlayProps = $props()
  const qrCode = useQrCodeContext()
  const mergedProps = $derived(mergeProps(qrCode().getOverlayProps(), props))
</script>

<UI as="div" {...mergedProps} />

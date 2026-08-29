<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface QrCodeFrameBaseProps extends PolymorphicProps<'svg'> {}
  export interface QrCodeFrameProps extends Assign<HTMLProps<'svg'>, QrCodeFrameBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useQrCodeContext } from '../hooks/use-qr-code-context'

  const props: QrCodeFrameProps = $props()
  const qrCode = useQrCodeContext()
  const mergedProps = $derived(mergeProps(qrCode().getFrameProps(), props))
</script>

<UI as="svg" {...mergedProps} />

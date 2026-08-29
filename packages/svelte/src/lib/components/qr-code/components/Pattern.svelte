<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface QrCodePatternBaseProps extends PolymorphicProps<'path'> {}
  export interface QrCodePatternProps extends Assign<HTMLProps<'path'>, QrCodePatternBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useQrCodeContext } from '../hooks/use-qr-code-context'

  const props: QrCodePatternProps = $props()
  const qrCode = useQrCodeContext()
  const mergedProps = $derived(mergeProps(qrCode().getPatternProps(), props))
</script>

<UI as="path" {...mergedProps} />

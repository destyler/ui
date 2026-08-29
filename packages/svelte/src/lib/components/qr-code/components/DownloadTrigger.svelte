<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { DownloadTriggerProps } from '@destyler/qr-code'

  export interface QrCodeDownloadTriggerBaseProps extends DownloadTriggerProps, PolymorphicProps<'button'> {}

  export interface QrCodeDownloadTriggerProps extends Assign<HTMLProps<'button'>, QrCodeDownloadTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useQrCodeContext } from '../hooks/use-qr-code-context'

  const props: QrCodeDownloadTriggerProps = $props()
  const [downloadTriggerProps, localProps] = $derived(
    createSplitProps<DownloadTriggerProps>()(props, ['fileName', 'mimeType', 'quality']),
  )
  const qrCode = useQrCodeContext()
  const mergedProps = $derived(mergeProps(qrCode().getDownloadTriggerProps(downloadTriggerProps), localProps))
</script>

<UI as="button" {...mergedProps} />

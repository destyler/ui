<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseQrCodeProps } from '../hooks/use-qr-code.svelte'

  export interface QrCodeRootBaseProps extends Optional<UseQrCodeProps, 'id'>, PolymorphicProps<'div'> {}
  export interface QrCodeRootProps extends Assign<HTMLProps<'div'>, QrCodeRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { QrCodeProvider } from '../hooks/use-qr-code-context'
  import { useQrCode } from '../hooks/use-qr-code.svelte'

  let { value = $bindable(), ...props }: QrCodeRootProps = $props()
  const providedId = $props.id()

  const [useQrCodeProps, localProps] = $derived(
    createSplitProps<Optional<UseQrCodeProps, 'id'>>()(props, [
      'defaultValue',
      'encoding',
      'id',
      'ids',
      'onValueChange',
      'value',
    ]),
  )

  const resolvedProps = $derived<UseQrCodeProps>({
    ...useQrCodeProps,
    id: useQrCodeProps.id ?? providedId,
    value,
    onValueChange(details) {
      value = details.value
      useQrCodeProps.onValueChange?.(details)
    },
  })

  const qrCode = useQrCode(() => resolvedProps)
  const mergedProps = $derived(mergeProps(qrCode().getRootProps(), localProps))

  QrCodeProvider(() => qrCode())
</script>

<UI as="div" {...mergedProps} />

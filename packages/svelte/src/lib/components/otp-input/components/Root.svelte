<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseOtpInputProps } from '../hooks/use-otp-input.svelte'

  export interface OtpInputRootBaseProps extends Optional<UseOtpInputProps, 'id'>, PolymorphicProps<'div'> {}
  export interface OtpInputRootProps extends Assign<HTMLProps<'div'>, OtpInputRootBaseProps> {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { OtpInputProvider } from '../hooks/use-otp-input-context'
  import { useOtpInput } from '../hooks/use-otp-input.svelte'

  let { value = $bindable(), ...props }: OtpInputRootProps = $props()
  const providedId = $props.id()

  const [useOtpInputProps, localProps] = $derived(
    createSplitProps<Optional<UseOtpInputProps, 'id'>>()(props, [
      'autoFocus',
      'blurOnComplete',
      'defaultValue',
      'disabled',
      'form',
      'id',
      'ids',
      'invalid',
      'mask',
      'name',
      'onValueChange',
      'onValueComplete',
      'onValueInvalid',
      'otp',
      'pattern',
      'placeholder',
      'readOnly',
      'required',
      'selectOnFocus',
      'translations',
      'type',
      'value',
    ]),
  )

  const resolvedProps = $derived<UseOtpInputProps>({
    ...useOtpInputProps,
    id: useOtpInputProps.id ?? providedId,
    value,
    onValueChange(details) {
      useOtpInputProps.onValueChange?.(details)
      value = details.value
    },
  })

  const otpInput = useOtpInput(() => resolvedProps)
  const mergedProps = $derived(mergeProps(otpInput().getRootProps(), localProps))

  OtpInputProvider(() => otpInput())
</script>

<UI as="div" {...mergedProps} />

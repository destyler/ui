<script module lang="ts">
  import type { InputProps } from '@destyler/otp-input'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface OtpInputInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
  export interface OtpInputInputProps extends Assign<HTMLProps<'input'>, OtpInputInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createInputValueSync } from '$lib/utils/sync-input-value'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const props: OtpInputInputProps = $props()
  const otpInput = useOtpInputContext()

  const [inputProps, localProps] = $derived(createSplitProps<InputProps>()(props, ['index']))

  const syncInputValue = createInputValueSync(() => otpInput().getInputProps(inputProps), () => otpInput().value)
  const mergedProps = $derived(mergeProps(otpInput().getInputProps(inputProps), localProps, {
    oninput: syncInputValue,
    oncompositionend: syncInputValue,
  }))
</script>

<UI as="input" {...mergedProps} />

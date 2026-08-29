<script module lang="ts">
  import type { InputProps } from '@destyler/otp-input'
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface OtpInputInputBaseProps extends InputProps, PolymorphicProps<'input'> {}
  export interface OtpInputInputProps extends Assign<HTMLProps<'input'>, OtpInputInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const props: OtpInputInputProps = $props()
  const otpInput = useOtpInputContext()

  const [inputProps, localProps] = $derived(createSplitProps<InputProps>()(props, ['index']))

  const mergedProps = $derived(mergeProps(otpInput().getInputProps(inputProps), localProps))
</script>

<UI as="input" {...mergedProps} />

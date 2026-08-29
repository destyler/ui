<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface OtpInputHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface OtpInputHiddenInputProps extends Assign<HTMLProps<'input'>, OtpInputHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const props: OtpInputHiddenInputProps = $props()
  const otpInput = useOtpInputContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(otpInput().getHiddenInputProps(), props))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />

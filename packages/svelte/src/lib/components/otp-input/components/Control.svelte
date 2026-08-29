<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface OtpInputControlBaseProps extends PolymorphicProps<'div'> {}
  export interface OtpInputControlProps extends Assign<HTMLProps<'div'>, OtpInputControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const props: OtpInputControlProps = $props()
  const otpInput = useOtpInputContext()
  const mergedProps = $derived(mergeProps(otpInput().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />

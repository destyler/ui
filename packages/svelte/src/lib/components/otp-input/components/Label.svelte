<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface OtpInputLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface OtpInputLabelProps extends Assign<HTMLProps<'label'>, OtpInputLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useOtpInputContext } from '../hooks/use-otp-input-context'

  const props: OtpInputLabelProps = $props()
  const otpInput = useOtpInputContext()
  const mergedProps = $derived(mergeProps(otpInput().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />

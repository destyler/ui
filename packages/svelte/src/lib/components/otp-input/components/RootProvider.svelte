<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { PolymorphicProps } from '$lib/types'
  import type { UseOtpInputReturn } from '../hooks/use-otp-input.svelte'

  interface RootProviderProps {
    value: UseOtpInputReturn
  }

  export interface OtpInputRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface OtpInputRootProviderProps extends OtpInputRootProviderBaseProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { OtpInputProvider } from '../hooks/use-otp-input-context'
  import { UI } from '../../factory'

  const { value, ...props }: OtpInputRootProviderProps = $props()

  OtpInputProvider(() => value())
  const mergedProps = $derived(mergeProps(value().getRootProps(), props))
</script>

<UI as="div" {...mergedProps} />

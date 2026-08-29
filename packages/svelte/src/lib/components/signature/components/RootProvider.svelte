<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseSignatureReturn } from '../hooks/use-signature.svelte'

  export interface SignatureRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseSignatureReturn
  }
  export interface SignatureRootProviderProps extends Assign<HTMLProps<'div'>, SignatureRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { SignatureProvider } from '../hooks/use-signature-context'

  let { value, ...props }: SignatureRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  SignatureProvider(() => value())
</script>

<UI as="div" {...mergedProps} />

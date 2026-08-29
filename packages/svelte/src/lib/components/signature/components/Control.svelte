<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureControlBaseProps extends PolymorphicProps<'div'> {}
  export interface SignatureControlProps extends Assign<HTMLProps<'div'>, SignatureControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignatureContext } from '../hooks/use-signature-context'

  const props: SignatureControlProps = $props()

  const signature = useSignatureContext()
  const mergedProps = $derived(mergeProps(signature().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />

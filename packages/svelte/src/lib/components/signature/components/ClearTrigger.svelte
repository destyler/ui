<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureClearTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface SignatureClearTriggerProps
    extends Assign<HTMLProps<'button'>, SignatureClearTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignatureContext } from '../hooks/use-signature-context'

  const props: SignatureClearTriggerProps = $props()

  const signature = useSignatureContext()
  const mergedProps = $derived(mergeProps(signature().getClearTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

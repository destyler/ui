<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface SignatureLabelProps extends Assign<HTMLProps<'label'>, SignatureLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignatureContext } from '../hooks/use-signature-context'

  const props: SignatureLabelProps = $props()

  const signature = useSignatureContext()
  const mergedProps = $derived(mergeProps(signature().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />

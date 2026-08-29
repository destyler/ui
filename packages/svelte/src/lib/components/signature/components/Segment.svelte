<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureSegmentBaseProps extends PolymorphicProps<'svg'> {}
  export interface SignatureSegmentProps extends Assign<HTMLProps<'svg'>, SignatureSegmentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignatureContext } from '../hooks/use-signature-context'

  const props: SignatureSegmentProps = $props()

  const signature = useSignatureContext()
  const mergedProps = $derived(mergeProps(signature().getSegmentProps(), props))

  const currentPath = $derived(signature().currentPath)
</script>

<UI as="svg" {...mergedProps}>
  <title>Signature</title>
  {#each signature().paths as path}
    <path {...signature().getSegmentPathProps({ path })} />
  {/each}
  {#if currentPath}
    <path {...signature().getSegmentPathProps({ path: currentPath })} />
  {/if}
</UI>

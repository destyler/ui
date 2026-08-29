<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureGuideBaseProps extends PolymorphicProps<'div'> {}
  export interface SignatureGuideProps extends Assign<HTMLProps<'div'>, SignatureGuideBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignatureContext } from '../hooks/use-signature-context'

  const props: SignatureGuideProps = $props()

  const signature = useSignatureContext()
  const mergedProps = $derived(mergeProps(signature().getGuideProps(), props))
</script>

<UI as="div" {...mergedProps} />

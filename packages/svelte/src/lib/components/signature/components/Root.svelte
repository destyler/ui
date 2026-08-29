<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseSignatureProps } from '../hooks/use-signature.svelte'

  export interface SignatureRootBaseProps extends Optional<UseSignatureProps, 'id'>, PolymorphicProps<'div'> {}
  export interface SignatureRootProps extends Assign<HTMLProps<'div'>, SignatureRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useSignature } from '../hooks/use-signature.svelte'
  import { SignatureProvider } from '../hooks/use-signature-context'

  const props: SignatureRootProps = $props()
  const providedId = $props.id()

  const [useSignatureProps, localProps] = $derived(
    createSplitProps<Optional<UseSignatureProps, 'id'>>()(props, [
      'id',
      'ids',
      'drawing',
      'disabled',
      'readOnly',
      'name',
      'onDraw',
      'onDrawEnd',
      'required',
      'translations',
    ]),
  )

  const resolvedProps = $derived<UseSignatureProps>({
    ...useSignatureProps,
    id: useSignatureProps.id ?? providedId,
  })

  const signature = useSignature(() => resolvedProps)
  const mergedProps = $derived(mergeProps(signature().getRootProps(), localProps))

  SignatureProvider(() => signature())
</script>

<UI as="div" {...mergedProps} />

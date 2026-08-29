<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface SignatureHiddenInputBaseProps extends PolymorphicProps<'input'>, HiddenInputProps {}
  export interface SignatureHiddenInputProps extends Assign<HTMLProps<'input'>, SignatureHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useSignatureContext } from '../hooks/use-signature-context'
  import { createSplitProps } from '$lib/utils/create-split-props'
  import type { HiddenInputProps } from '@destyler/signature'

  const props: SignatureHiddenInputProps = $props()
  const [hiddenInputProps, localProps] = $derived(createSplitProps<HiddenInputProps>()(props, ['value']))

  const signature = useSignatureContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(signature().getHiddenInputProps(hiddenInputProps), localProps))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />

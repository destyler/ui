<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioItemHiddenInputBaseProps extends PolymorphicProps<'input'> {}
  export interface RadioItemHiddenInputProps
    extends Assign<HTMLProps<'input'>, RadioItemHiddenInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'
  import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

  const props: RadioItemHiddenInputProps = $props()

  const radioGroup = useRadioContext()
  const itemProps = useRadioItemPropsContext()

  const mergedProps = $derived(mergeProps(radioGroup().getItemHiddenInputProps(itemProps()), props))
</script>

<UI as="input" {...mergedProps} />

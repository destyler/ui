<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioItemTextBaseProps extends PolymorphicProps<'span'> {}
  export interface RadioItemTextProps extends Assign<HTMLProps<'span'>, RadioItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'
  import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

  const props: RadioItemTextProps = $props()

  const radioGroup = useRadioContext()
  const itemProps = useRadioItemPropsContext()

  const mergedProps = $derived(mergeProps(radioGroup().getItemTextProps(itemProps()), props))
</script>

<UI as="span" {...mergedProps} />

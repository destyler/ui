<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface RadioItemControlBaseProps extends PolymorphicProps<'div'> {}
  export interface RadioItemControlProps extends Assign<HTMLProps<'div'>, RadioItemControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'
  import { useRadioItemPropsContext } from '../hooks/use-radio-item-props-context'

  const props: RadioItemControlProps = $props()

  const radioGroup = useRadioContext()
  const itemProps = useRadioItemPropsContext()

  const mergedProps = $derived(mergeProps(radioGroup().getItemControlProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />

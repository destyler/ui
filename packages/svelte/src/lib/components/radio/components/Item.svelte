<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/radio'

  export interface RadioItemBaseProps extends ItemProps, PolymorphicProps<'label'> {}
  export interface RadioItemProps extends Assign<HTMLProps<'label'>, RadioItemBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRadioContext } from '../hooks/use-radio-context'
  import { RadioItemProvider } from '../hooks/use-radio-item-context'
  import { RadioItemPropsProvider } from '../hooks/use-radio-item-props-context'

  const props: RadioItemProps = $props()
  const radioGroup = useRadioContext()

  const itemState = $derived(radioGroup().getItemState(props))
  const mergedProps = $derived(mergeProps(radioGroup().getItemProps(props), props))

  RadioItemProvider(() => itemState)
  RadioItemPropsProvider(() => props)
</script>

<UI as="label" {...mergedProps} />

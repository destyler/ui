<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicItemInputBaseProps extends PolymorphicProps<'input'> {}
  export interface DynamicItemInputProps extends Assign<HTMLProps<'input'>, DynamicItemInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'
  import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

  const props: DynamicItemInputProps = $props()
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = $derived(mergeProps(dynamic().getItemInputProps(itemProps()), props))
</script>

<UI as="input" {...mergedProps} />

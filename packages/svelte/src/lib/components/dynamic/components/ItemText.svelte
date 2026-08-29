<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicItemTextBaseProps extends PolymorphicProps<'span'> {}
  export interface DynamicItemTextProps extends Assign<HTMLProps<'span'>, DynamicItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'
  import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

  const props: DynamicItemTextProps = $props()
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = $derived(mergeProps(dynamic().getItemTextProps(itemProps()), props))
</script>

<UI as="span" {...mergedProps} />

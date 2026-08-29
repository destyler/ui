<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicItemPreviewBaseProps extends PolymorphicProps<'div'> {}
  export interface DynamicItemPreviewProps extends Assign<HTMLProps<'div'>, DynamicItemPreviewBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'
  import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

  const props: DynamicItemPreviewProps = $props()
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = $derived(mergeProps(dynamic().getItemPreviewProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />

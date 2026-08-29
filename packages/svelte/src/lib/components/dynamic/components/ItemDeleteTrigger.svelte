<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface DynamicItemDeleteTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface DynamicItemDeleteTriggerProps
    extends Assign<HTMLProps<'button'>, DynamicItemDeleteTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useDynamicContext } from '../hooks/use-dynamic-context'
  import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

  const props: DynamicItemDeleteTriggerProps = $props()
  const dynamic = useDynamicContext()
  const itemProps = useDynamicItemPropsContext()
  const mergedProps = $derived(mergeProps(dynamic().getItemDeleteTriggerProps(itemProps()), props))
</script>

<UI as="button" {...mergedProps} />

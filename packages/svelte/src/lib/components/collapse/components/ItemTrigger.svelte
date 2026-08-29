<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CollapseItemTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CollapseItemTriggerProps extends Assign<HTMLProps<'button'>, CollapseItemTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { useCollapsibleContext } from '../../collapsible'
  import { UI } from '../../factory'
  import { useCollapseContext } from '../hooks/use-collapse-context'
  import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

  const props: CollapseItemTriggerProps = $props()

  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()

  const collapsible = useCollapsibleContext()
  const triggerProps = $derived(collapse().getItemTriggerProps(itemProps()))

  const mergedProps = $derived(
    mergeProps(
      {
        ...triggerProps,
        'aria-controls': collapsible().isUnmounted ? undefined : triggerProps['aria-controls'],
      },
      props,
    ),
  )
  const ariaExpanded = $derived(triggerProps['aria-expanded'] ? 'true' : 'false')
</script>

<UI as="button" {...mergedProps} aria-expanded={ariaExpanded} />

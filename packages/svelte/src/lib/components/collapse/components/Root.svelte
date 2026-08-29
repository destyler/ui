<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseCollapseProps } from '../hooks/use-collapse.svelte'

  export interface CollapseRootBaseProps
    extends Optional<UseCollapseProps, 'id'>,
      RenderStrategyProps,
      PolymorphicProps<'div'> {}
  export interface CollapseRootProps extends Assign<HTMLProps<'div'>, CollapseRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import {
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
    type RenderStrategyProps,
  } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CollapseProvider } from '../hooks/use-collapse-context'
  import { useCollapse } from '../hooks/use-collapse.svelte'

  let { value = $bindable(), ...props }: CollapseRootProps = $props()
  const providedId = $props.id()

  const [renderStrategyProps, collapseProps] = $derived(splitRenderStrategyProps(props))
  const [useCollapseProps, localProps] = $derived(
    createSplitProps<Optional<UseCollapseProps, 'id'>>()(collapseProps, [
      'collapsible',
      'defaultValue',
      'disabled',
      'id',
      'ids',
      'multiple',
      'onFocusChange',
      'onValueChange',
      'orientation',
      'value',
    ]),
  )

  const resolvedProps = $derived<UseCollapseProps>({
    ...useCollapseProps,
    id: useCollapseProps.id ?? providedId,
    value,
    onValueChange(details) {
      useCollapseProps.onValueChange?.(details)
      if (value !== undefined) value = details.value
    },
  })

  const collapse = useCollapse(() => resolvedProps)
  const mergedProps = $derived(mergeProps(collapse().getRootProps(), localProps))

  RenderStrategyPropsProvider(() => renderStrategyProps)
  CollapseProvider(() => collapse())
</script>

<UI as="div" {...mergedProps} />

<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseCollapseReturn } from '../hooks/use-collapse.svelte'

  export interface CollapseRootProviderBaseProps extends PolymorphicProps<'div'>, RenderStrategyProps {
    value: UseCollapseReturn
  }
  export interface CollapseRootProviderProps extends Assign<HTMLProps<'div'>, CollapseRootProviderBaseProps> {}
</script>

<script lang="ts">
  import {
    type RenderStrategyProps,
    RenderStrategyPropsProvider,
    splitRenderStrategyProps,
  } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CollapseProvider } from '../hooks/use-collapse-context'

  let { value, ...props }: CollapseRootProviderProps = $props()

  const [renderStrategyProps, localProps] = $derived(splitRenderStrategyProps(props))
  const mergedProps = $derived(mergeProps(value().getRootProps(), localProps))

  CollapseProvider(() => value())
  RenderStrategyPropsProvider(() => renderStrategyProps)
</script>

<UI as="div" {...mergedProps} />

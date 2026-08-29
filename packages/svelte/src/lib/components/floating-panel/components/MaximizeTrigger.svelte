<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FloatingPanelMaximizeTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface FloatingPanelMaximizeTriggerProps
    extends Assign<HTMLProps<'button'>, FloatingPanelMaximizeTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

  const props: FloatingPanelMaximizeTriggerProps = $props()
  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getMaximizeTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

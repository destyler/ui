<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FloatingPanelMinimizeTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface FloatingPanelMinimizeTriggerProps
    extends Assign<HTMLProps<'button'>, FloatingPanelMinimizeTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

  const props: FloatingPanelMinimizeTriggerProps = $props()
  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getMinimizeTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

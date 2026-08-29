<script lang="ts" module>
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface FloatingPanelDragTriggerBaseProps extends PolymorphicProps<'div'> {}
  export interface FloatingPanelDragTriggerProps extends Assign<HTMLProps<'div'>, FloatingPanelDragTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context.js'

  let props: FloatingPanelDragTriggerProps = $props()

  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getDragTriggerProps(), props))
</script>

<UI as="div" {...mergedProps} />

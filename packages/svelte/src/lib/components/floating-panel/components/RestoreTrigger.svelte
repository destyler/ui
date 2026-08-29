<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FloatingPanelRestoreTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface FloatingPanelRestoreTriggerProps
    extends Assign<HTMLProps<'button'>, FloatingPanelRestoreTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context'

  const props: FloatingPanelRestoreTriggerProps = $props()
  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getRestoreTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

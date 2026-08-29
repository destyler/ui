<script lang="ts" module>
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface FloatingPanelBodyBaseProps extends PolymorphicProps<'div'> {}
  export interface FloatingPanelBodyProps extends Assign<HTMLProps<'div'>, FloatingPanelBodyBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context.js'

  let props: FloatingPanelBodyProps = $props()

  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getBodyProps(), props))
</script>

<UI as="div" {...mergedProps} />

<script lang="ts" module>
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'

  export interface FloatingPanelPositionerBaseProps extends PolymorphicProps<'div'> {}
  export interface FloatingPanelPositionerProps extends Assign<HTMLProps<'div'>, FloatingPanelPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { usePresenceContext } from '../../presence/index.js'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context.js'

  let props: FloatingPanelPositionerProps = $props()

  const floatingPanel = useFloatingPanelContext()
  const presence = usePresenceContext()

  const mergedProps = $derived(mergeProps(floatingPanel().getPositionerProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}

<script lang="ts" module>
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types.js'
  import type { UsePresenceProps } from '../../presence'
  import type { UseFloatingPanelProps } from '../hooks/use-floating-panel.svelte.js'

  export interface FloatingPanelRootBaseProps
    extends Optional<UseFloatingPanelProps, 'id'>,
      UsePresenceProps,
      PolymorphicProps<'div'> {}
  export interface FloatingPanelRootProps extends Assign<HTMLProps<'div'>, FloatingPanelRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props.js'
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence/index.js'
  import { UI } from '../../factory/index.js'
  import { FloatingPanelProvider } from '../hooks/use-floating-panel-context.js'
  import { useFloatingPanel } from '../hooks/use-floating-panel.svelte.js'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    open = $bindable(),
    open: openProp,
    position = $bindable(),
    position: positionProp,
    size = $bindable(),
    size: sizeProp,
    ...props
  }: FloatingPanelRootProps = $props()
  const providedId = $props.id()

  const [presenceProps, otherProps] = $derived(splitPresenceProps(props))
  const [floatingPanelProps, localProps] = $derived(createSplitProps<Optional<UseFloatingPanelProps, 'id'>>()(otherProps, [
    'allowOverflow',
    'closeOnEscape',
    'defaultOpen',
    'disabled',
    'draggable',
    'getAnchorPosition',
    'getBoundaryEl',
    'gridSize',
    'id',
    'ids',
    'lockAspectRatio',
    'maxSize',
    'minSize',
    'onOpenChange',
    'onPositionChange',
    'onPositionChangeEnd',
    'onSizeChange',
    'onSizeChangeEnd',
    'onStageChange',
    'open',
    'persistRect',
    'position',
    'resizable',
    'size',
    'strategy',
  ]))

  const resolvedProps = $derived<UseFloatingPanelProps>({
    ...floatingPanelProps,
    id: floatingPanelProps.id ?? providedId,
    open: openProp,
    onOpenChange(details) {
      floatingPanelProps.onOpenChange?.(details)
      open = details.open
    },
    position: positionProp,
    onPositionChange(details) {
      floatingPanelProps.onPositionChange?.(details)
      position = details.position
    },
    size: sizeProp,
    onSizeChange(details) {
      floatingPanelProps.onSizeChange?.(details)
      size = details.size
    },
  })

  const floatingPanel = useFloatingPanel(() => resolvedProps)
  FloatingPanelProvider(() => floatingPanel())

  const usePresenceProps = $derived(mergeProps({ present: floatingPanel().open }, presenceProps))
  const presence = usePresence(() => usePresenceProps)

  PresenceProvider(() => presence())
</script>

<UI as="div" {...localProps} />

<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { Optional } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseDialogProps } from '../hooks/use-dialog.svelte'

  export interface DialogRootBaseProps extends Optional<UseDialogProps, 'id'>, UsePresenceProps {}
  export interface DialogRootProps extends DialogRootBaseProps {
    children?: Snippet
  }
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { RenderStrategyPropsProvider, splitRenderStrategyProps } from '$lib/utils/render-strategy'
  import { DialogProvider } from '../hooks/use-dialog-context'
  import { useDialog } from '../hooks/use-dialog.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    open = $bindable(),
    open: openProp,
    children,
    ...props
  }: DialogRootProps = $props()

  const providedId = $props.id()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))
  const [renderStrategyProps] = $derived(splitRenderStrategyProps(presenceProps))

  const machineProps = $derived.by<UseDialogProps>(() => {
    return {
      ...localProps,
      id: localProps.id ?? providedId,
      open: openProp,
      onOpenChange(details) {
        localProps.onOpenChange?.(details)
        open = details.open
      },
    }
  })

  const dialog = useDialog(() => machineProps)

  const presenceMachineProps = $derived<UsePresenceProps>(
    mergeProps({ present: dialog().open }, presenceProps),
  )

  const presence = usePresence(() => presenceMachineProps)

  DialogProvider(() => dialog())
  RenderStrategyPropsProvider(() => renderStrategyProps)
  PresenceProvider(() => presence())
</script>

{@render children?.()}

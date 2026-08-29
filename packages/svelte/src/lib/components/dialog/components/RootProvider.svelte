<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { RenderStrategyProps } from '$lib/utils/render-strategy'
  import type { UsePresenceProps } from '../../presence'
  import type { UseDialogReturn } from '../hooks/use-dialog.svelte'

  export interface DialogRootProviderBaseProps
    extends UsePresenceProps, RenderStrategyProps, PolymorphicProps<'div'> {
    value: UseDialogReturn
  }
  export interface DialogRootProviderProps extends Assign<HTMLProps<'div'>, DialogRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { RenderStrategyPropsProvider, splitRenderStrategyProps } from '$lib/utils/render-strategy'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { DialogProvider } from '../hooks/use-dialog-context'

  let { value, ...props }: DialogRootProviderProps = $props()
  const [renderStrategyProps, restProps] = $derived(splitRenderStrategyProps(props))
  const [presenceProps, localProps] = $derived(splitPresenceProps(restProps))
  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))

  DialogProvider(() => value())
  RenderStrategyPropsProvider(() => renderStrategyProps)
  PresenceProvider(() => presence())
</script>

<UI as="div" {...localProps} />

<script module lang="ts">
  import type { Accessor, Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type * as ToastTypes from '@destyler/toast'
  import type { Snippet } from 'svelte'
  import type { CreateToasterReturn } from '../hooks/create-toaster'

  export interface ToasterBaseProps extends Omit<PolymorphicProps<'div'>, 'children'> {
    toaster: CreateToasterReturn
    children: Snippet<[Accessor<ToastTypes.Options<Snippet>>]>
  }

  export interface ToasterProps extends Assign<HTMLProps<'div'>, ToasterBaseProps> {}
</script>

<script lang="ts">
  import type { PropTypes } from '@destyler/svelte'
  import { useMachine } from '$lib/hooks/use-destyler-machine.svelte.js'
  import { mergeProps, normalizeProps } from '@destyler/svelte'
  import * as toast from '@destyler/toast'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import ToasterItem from './ToasterItem.svelte'

  let { toaster, children, ...props }: ToasterProps = $props()
  const initialToaster = untrack(() => toaster)
  const [state, send] = useMachine(initialToaster.machine, {
    get context() {
      return initialToaster.machine.state.context
    },
  })
  const placement = $derived(state.context.placement)
  const api = $derived(
    toast.group.connect<PropTypes, Snippet>(state as toast.GroupState<Snippet>, send, normalizeProps),
  )
  const toasts = $derived(api.getToastsByPlacement(placement))
  const mergedProps = $derived(mergeProps(api.getGroupProps({ placement }), props))
</script>

<UI as="div" {...mergedProps}>
  {#each toasts as item (item.id)}
    <ToasterItem value={item} render={children} />
  {/each}
</UI>

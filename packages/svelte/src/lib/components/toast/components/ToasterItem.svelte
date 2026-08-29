<script lang="ts">
  import type { Accessor } from '$lib/types'
  import { useActor } from '$lib/hooks/use-destyler-machine.svelte.js'
  import { normalizeProps } from '$lib/utils/normalize-props'
  import type { PropTypes } from '@destyler/svelte'
  import * as toast from '@destyler/toast'
  import { untrack, type Snippet } from 'svelte'
  import { ToastProvider } from '../hooks/use-toast-context'

  interface ToasterItemProps {
    value: toast.Service<Snippet>
    render: Snippet<[Accessor<toast.Options<Snippet>>]>
  }

  const { value, render }: ToasterItemProps = $props()
  const initialValue = untrack(() => value)
  const [state, send] = useActor(initialValue)
  const api = $derived(toast.connect<PropTypes, Snippet>(state, send, normalizeProps))
  const options = (): toast.Options<Snippet> => state.context

  ToastProvider(() => api)
</script>

{@render render(options)}

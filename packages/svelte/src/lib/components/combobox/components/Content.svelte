<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface ComboboxContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface ComboboxContentProps extends Assign<HTMLProps<'div'>, ComboboxContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { untrack } from 'svelte'
  import { UI } from '../../factory'
  import { useComboboxContext } from '../hooks/use-combobox-context'
  import { usePresenceContext } from '../../presence'

  let { ref = $bindable<Element | null>(), ...props }: ComboboxContentProps = $props()

  const combobox = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(combobox().getContentProps(), presence().getPresenceProps(), props))

  function setNode(node: HTMLDivElement) {
    untrack(() => {
      presence().setNode(node)
      ref = node
    })
  }
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} {@attach setNode} />
{/if}

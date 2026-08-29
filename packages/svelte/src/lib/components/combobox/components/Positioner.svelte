<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ComboboxPositionerBaseProps extends PolymorphicProps<'div'> {}
  export interface ComboboxPositionerProps extends Assign<HTMLProps<'div'>, ComboboxPositionerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useComboboxContext } from '../hooks/use-combobox-context'

  const props: ComboboxPositionerProps = $props()

  const combobox = useComboboxContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(combobox().getPositionerProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}

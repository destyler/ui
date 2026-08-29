<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps, RefAttribute } from '$lib/types'

  export interface ColorPickerContentBaseProps extends PolymorphicProps<'div'>, RefAttribute {}
  export interface ColorPickerContentProps extends Assign<HTMLProps<'div'>, ColorPickerContentBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { usePresenceContext } from '../../presence'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  const props: ColorPickerContentProps = $props()

  const colorPicker = useColorPickerContext()
  const presence = usePresenceContext()
  const mergedProps = $derived(mergeProps(colorPicker().getContentProps(), presence().getPresenceProps(), props))
</script>

{#if !presence().unmounted}
  <UI as="div" {...mergedProps} />
{/if}

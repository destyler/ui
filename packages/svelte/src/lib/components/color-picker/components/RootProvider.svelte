<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseColorPickerReturn } from '../hooks/use-color-picker.svelte'

  export interface ColorPickerRootProviderBaseProps extends PolymorphicProps<'div'>, UsePresenceProps {
    value: UseColorPickerReturn
  }
  export interface ColorPickerRootProviderProps extends Assign<HTMLProps<'div'>, ColorPickerRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PresenceProvider, splitPresenceProps, usePresence, type UsePresenceProps } from '../../presence'
  import { ColorPickerProvider } from '../hooks/use-color-picker-context'

  let { value, ...props }: ColorPickerRootProviderProps = $props()

  const [presenceProps, localProps] = $derived(splitPresenceProps(props))

  const presence = usePresence(() => mergeProps({ present: value().open }, presenceProps))
  const mergedProps = $derived(mergeProps(value().getRootProps(), localProps))

  ColorPickerProvider(() => value())
  PresenceProvider(() => presence())
</script>

<UI as="div" {...mergedProps} />

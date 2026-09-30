<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UsePresenceProps } from '../../presence'
  import type { UseColorPickerProps } from '../hooks/use-color-picker.svelte'

  export interface ColorPickerRootBaseProps
    extends Optional<UseColorPickerProps, 'id'>,
      UsePresenceProps,
      PolymorphicProps<'div'> {}
  export interface ColorPickerRootProps extends Assign<HTMLProps<'div'>, ColorPickerRootBaseProps> {}
</script>

<script lang="ts">
  import type { Color } from '@destyler/color-picker'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { PresenceProvider, splitPresenceProps, usePresence } from '../../presence'
  import { splitColorPickerProps } from '../hooks/split-color-picker-props.svelte'
  import { ColorPickerProvider } from '../hooks/use-color-picker-context'
  import { useColorPicker } from '../hooks/use-color-picker.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable<Color>(),
    value: valueProp,
    open = $bindable<boolean>(),
    open: openProp,
    ...props
  }: ColorPickerRootProps = $props()
  const providedId = $props.id()

  const [presenceProps, colorPickerProps] = $derived(splitPresenceProps(props))
  const [useColorPickerProps, localProps] = $derived(splitColorPickerProps(colorPickerProps))

  const machineProps = $derived<UseColorPickerProps>({
    ...useColorPickerProps,
    id: useColorPickerProps.id ?? providedId,
    value: valueProp,
    open: openProp,
    onValueChange(details) {
      useColorPickerProps.onValueChange?.(details)
      value = details.value
    },
    onOpenChange(details) {
      useColorPickerProps.onOpenChange?.(details)
      open = details.open
    },
  })

  const colorPicker = useColorPicker(() => machineProps)
  const presence = usePresence(() => mergeProps({ present: colorPicker().open }, presenceProps))

  const mergedProps = $derived(mergeProps(colorPicker().getRootProps(), localProps))

  ColorPickerProvider(() => colorPicker())
  PresenceProvider(() => presence())
</script>

<UI as="div" {...mergedProps} />

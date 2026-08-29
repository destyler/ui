<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerChannelSliderThumbBaseProps extends PolymorphicProps<'div'> {}
  export interface ColorPickerChannelSliderThumbProps
    extends Assign<HTMLProps<'div'>, ColorPickerChannelSliderThumbBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerChannelPropsContext } from '../hooks/use-color-picker-channel-props-context'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

  const props: ColorPickerChannelSliderThumbProps = $props()

  const colorPicker = useColorPickerContext()

  const channelProps = useColorPickerChannelPropsContext()
  const formatProps = useColorPickerFormatPropsContext()
  const channelSliderProps = $derived({ ...channelProps(), ...formatProps() })

  const mergedProps = $derived(mergeProps(colorPicker().getChannelSliderThumbProps(channelSliderProps), props))
</script>

<UI as="div" {...mergedProps} />

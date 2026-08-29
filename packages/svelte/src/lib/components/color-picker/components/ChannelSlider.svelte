<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ChannelProps } from '@destyler/color-picker'

  export interface ColorPickerChannelSliderBaseProps extends ChannelProps, PolymorphicProps<'div'> {}
  export interface ColorPickerChannelSliderProps extends Assign<HTMLProps<'div'>, ColorPickerChannelSliderBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { ColorPickerChannelPropsProvider } from '../hooks/use-color-picker-channel-props-context'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useColorPickerFormatPropsContext } from '../hooks/use-color-picker-format-context'

  const props: ColorPickerChannelSliderProps = $props()

  const [channelProps, localProps] = $derived(createSplitProps<ChannelProps>()(props, ['channel', 'orientation']))

  const colorPicker = useColorPickerContext()

  const formatProps = useColorPickerFormatPropsContext()
  const channelSliderProps = $derived({ ...channelProps, ...formatProps() })

  const mergedProps = $derived(mergeProps(colorPicker().getChannelSliderProps(channelSliderProps), localProps))

  ColorPickerChannelPropsProvider(() => channelProps)
</script>

<UI as="div" {...mergedProps} />

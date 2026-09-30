<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ChannelInputProps } from '@destyler/color-picker'

  export interface ColorPickerChannelInputBaseProps extends ChannelInputProps, PolymorphicProps<'input'> {}
  export interface ColorPickerChannelInputProps extends Assign<HTMLProps<'input'>, ColorPickerChannelInputBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { createInputValueSync } from '$lib/utils/sync-input-value'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'

  const props: ColorPickerChannelInputProps = $props()

  const [channelProps, localProps] = $derived(createSplitProps<ChannelInputProps>()(props, ['channel', 'orientation']))

  const colorPicker = useColorPickerContext()
  const syncInputValue = createInputValueSync(() => colorPicker().getChannelInputProps(channelProps), () => colorPicker().value)
  const mergedProps = $derived(mergeProps(colorPicker().getChannelInputProps(channelProps), localProps, {
    onfocusout: syncInputValue,
    onkeydown(event: KeyboardEvent) {
      if (event.key === 'Enter' && !event.isComposing)
        void syncInputValue(event)
    },
  }))
</script>

<UI as="input" {...mergedProps} />

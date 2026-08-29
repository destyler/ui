<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { AreaProps } from '@destyler/color-picker'

  export interface ColorPickerAreaBaseProps extends AreaProps, PolymorphicProps<'div'> {}
  export interface ColorPickerAreaProps extends Assign<HTMLProps<'div'>, ColorPickerAreaBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { ColorPickerAreaPropsProvider } from '../hooks/use-color-picker-area-props-context'

  const props: ColorPickerAreaProps = $props()

  const [areaProps, localProps] = $derived(createSplitProps<AreaProps>()(props, ['xChannel', 'yChannel']))

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getAreaProps(areaProps), localProps))

  ColorPickerAreaPropsProvider(() => areaProps)
</script>

<UI as="div" {...mergedProps} />

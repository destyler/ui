<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerTransparencyGridBaseProps extends TransparencyGridProps, PolymorphicProps<'div'> {}
  export interface ColorPickerTransparencyGridProps
    extends Assign<HTMLProps<'div'>, ColorPickerTransparencyGridBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import type { TransparencyGridProps } from '@destyler/color-picker'
  import { createSplitProps } from '$lib/utils/create-split-props'

  const props: ColorPickerTransparencyGridProps = $props()

  const [gridProps, localProps] = $derived(createSplitProps<TransparencyGridProps>()(props, ['size']))

  const colorPicker = useColorPickerContext()
  const mergedProps = $derived(mergeProps(colorPicker().getTransparencyGridProps(gridProps), localProps))
</script>

<UI as="div" {...mergedProps} />

<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerAreaThumbBaseProps extends PolymorphicProps<'div'> {}
  export interface ColorPickerAreaThumbProps extends Assign<HTMLProps<'div'>, ColorPickerAreaThumbBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'

  const props: ColorPickerAreaThumbProps = $props()

  const colorPicker = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()

  const mergedProps = $derived(mergeProps(colorPicker().getAreaThumbProps(areaProps()), props))
</script>

<UI as="div" {...mergedProps} />

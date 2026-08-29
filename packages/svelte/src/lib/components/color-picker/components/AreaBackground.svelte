<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface ColorPickerAreaBackgroundBaseProps extends PolymorphicProps<'div'> {}
  export interface ColorPickerAreaBackgroundProps
    extends Assign<HTMLProps<'div'>, ColorPickerAreaBackgroundBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useColorPickerContext } from '../hooks/use-color-picker-context'
  import { useColorPickerAreaPropsContext } from '../hooks/use-color-picker-area-props-context'

  const props: ColorPickerAreaBackgroundProps = $props()

  const colorPicker = useColorPickerContext()
  const areaProps = useColorPickerAreaPropsContext()

  const mergedProps = $derived(mergeProps(colorPicker().getAreaBackgroundProps(areaProps()), props))
</script>

<UI as="div" {...mergedProps} />

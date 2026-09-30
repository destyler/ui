<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseRadioProps } from '../hooks/use-radio.svelte'

  export interface RadioRootBaseProps extends Optional<UseRadioProps, 'id'>, PolymorphicProps<'div'> {}
  export interface RadioRootProps extends Assign<HTMLProps<'div'>, RadioRootBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { RadioProvider } from '../hooks/use-radio-context'
  import { useRadio } from '../hooks/use-radio.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable(),
    value: valueProp,
    ...props
  }: RadioRootProps = $props()
  const providedId = $props.id()

  const [radioGroupProps, localProps] = $derived(
    createSplitProps<Optional<UseRadioProps, 'id'>>()(props, [
      'defaultValue',
      'disabled',
      'form',
      'id',
      'ids',
      'name',
      'onValueChange',
      'orientation',
      'readOnly',
      'value',
    ]),
  )

  const resolvedProps = $derived<UseRadioProps>({
    ...radioGroupProps,
    id: radioGroupProps.id ?? providedId,
    value: valueProp,
    onValueChange(details) {
      radioGroupProps.onValueChange?.(details)
      value = details.value
    },
  })

  const radioGroup = useRadio(() => resolvedProps)
  const mergedProps = $derived(mergeProps(radioGroup().getRootProps(), localProps))

  RadioProvider(radioGroup)
</script>

<UI as="div" {...mergedProps} />

<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseNumberInputProps } from '../hooks/use-number-input.svelte'

  export interface NumberInputRootBaseProps
    extends Optional<UseNumberInputProps, 'id'>,
      PolymorphicProps<'div'> {}
  export interface NumberInputRootProps extends Assign<HTMLProps<'div'>, NumberInputRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { NumberInputProvider } from '../hooks/use-number-input-context'
  import { splitNumberInputProps } from '../hooks/split-number-input-props.svelte'
  import { useNumberInput } from '../hooks/use-number-input.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable(),
    value: valueProp,
    ...props
  }: NumberInputRootProps = $props()
  const providedId = $props.id()

  const [useNumberInputProps, localProps] = $derived(splitNumberInputProps(props))

  const resolvedProps = $derived<UseNumberInputProps>({
    ...useNumberInputProps,
    id: useNumberInputProps.id ?? providedId,
    value: valueProp,
    onValueChange(details) {
      useNumberInputProps.onValueChange?.(details)
      value = details.value
    },
  })

  const numberInput = useNumberInput(() => resolvedProps)
  const mergedProps = $derived(mergeProps(numberInput().getRootProps(), localProps))

  NumberInputProvider(() => numberInput())
</script>

<UI as="div" {...mergedProps} />

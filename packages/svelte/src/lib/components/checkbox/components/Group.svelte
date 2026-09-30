<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseCheckboxGroupProps } from '../hooks/use-checkbox-group.svelte'

  export interface CheckboxGroupBaseProps extends UseCheckboxGroupProps, PolymorphicProps<'div'> {}
  export interface CheckboxGroupProps extends Assign<HTMLProps<'div'>, CheckboxGroupBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'
  import { checkboxAnatomy } from '../anatomy'
  import { CheckboxGroupProvider } from '../hooks/use-checkbox-group-context'
  import { splitCheckboxGroupProps } from '../hooks/split-checkbox-group-props.svelte'
  import { useCheckboxGroup } from '../hooks/use-checkbox-group.svelte'

  // Read the parent prop independently from the writable binding. Local writes
  // notify bind: consumers without overriding ordinary controlled props.
  let {
    value = $bindable(),
    value: valueProp,
    ...props
  }: CheckboxGroupProps = $props()

  const [checkboxGroupProps, localProps] = $derived(splitCheckboxGroupProps(props))

  const resolvedProps = $derived<UseCheckboxGroupProps>({
    ...checkboxGroupProps,
    value: valueProp,
    onValueChange(newValue) {
      checkboxGroupProps.onValueChange?.(newValue)
      value = newValue
    },
  })

  const checkboxGroup = useCheckboxGroup(() => resolvedProps)

  CheckboxGroupProvider(checkboxGroup)
</script>

<UI as="div" role="group" {...checkboxAnatomy.build().group.attrs} {...localProps} />

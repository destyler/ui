<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseCheckboxProps } from '../hooks/use-checkbox.svelte'

  export interface CheckboxRootBaseProps extends Optional<UseCheckboxProps, 'id'>, PolymorphicProps<'label'> {}
  export interface CheckboxRootProps extends Assign<HTMLProps<'label'>, CheckboxRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { CheckboxProvider } from '../hooks/use-checkbox-context'
  import { splitCheckboxProps } from '../hooks/split-checkbox-props.svelte'
  import { useCheckbox } from '../hooks/use-checkbox.svelte'

  let { checked = $bindable(), ...props }: CheckboxRootProps = $props()
  const providedId = $props.id()

  const [useCheckboxProps, localProps] = $derived(splitCheckboxProps(props))

  const resolvedProps = $derived<UseCheckboxProps>({
    ...useCheckboxProps,
    id: useCheckboxProps.id ?? providedId,
    checked,
    onCheckedChange(details) {
      useCheckboxProps.onCheckedChange?.(details)
      checked = details.checked
    },
  })

  const checkbox = useCheckbox(() => resolvedProps)
  const mergedProps = $derived(mergeProps(checkbox().getRootProps(), localProps))

  CheckboxProvider(() => checkbox())
</script>

<UI as="label" {...mergedProps} />

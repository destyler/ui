<script module lang="ts">
  import type { Assign, HTMLProps, Optional } from '$lib/types'
  import type { UseEditProps } from '../hooks/use-edit.svelte'

  export interface EditRootBaseProps extends Optional<UseEditProps, 'id'> {}
  export interface EditRootProps extends Assign<HTMLProps<'div'>, EditRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { splitEditProps } from '../hooks/edit-split-props'
  import { EditProvider } from '../hooks/use-edit-context'
  import { useEdit } from '../hooks/use-edit.svelte'

  let { value = $bindable(), edit = $bindable(), ...props }: EditRootProps = $props()

  const providedId = $props.id()

  const [useEditProps, localProps] = $derived(splitEditProps(props))

  const machineProps = $derived.by<UseEditProps>(() => {
    return {
      ...useEditProps,
      id: useEditProps.id ?? providedId,
      value,
      edit,
      onValueChange(details) {
        useEditProps.onValueChange?.(details)
        value = details.value
      },
      onEditChange(details) {
        useEditProps.onEditChange?.(details)
        if (edit !== undefined)
          edit = details.edit
      },
    }
  })

  const editable = useEdit(() => machineProps)
  const mergedProps = $derived(mergeProps(editable().getRootProps(), localProps))

  EditProvider(() => editable())
</script>

<UI as="div" {...mergedProps} />

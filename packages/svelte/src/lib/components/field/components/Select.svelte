<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldSelectBaseProps extends PolymorphicProps<'select'> {}
  export interface FieldSelectProps extends Assign<HTMLProps<'select'>, FieldSelectBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../hooks/use-field-context'

  let { value = $bindable(), multiple, ...props }: FieldSelectProps = $props()
  const field = useFieldContext()
  const nativeSelectProps: HTMLProps<'select'> = $derived({
    value,
    multiple,
    oninput(event) {
      value = multiple
        ? Array.from(event.currentTarget.selectedOptions).map(option => option.value)
        : event.currentTarget.value
    },
  })
  const mergedProps = $derived(mergeProps(field?.().getSelectProps() ?? {}, nativeSelectProps, props))
</script>

<UI as="select" {...mergedProps} />

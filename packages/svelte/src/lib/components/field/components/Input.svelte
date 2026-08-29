<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FieldInputBaseProps extends PolymorphicProps<'input'> {}
  export interface FieldInputProps extends Assign<HTMLProps<'input'>, FieldInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../hooks/use-field-context'

  let { value = $bindable(), ...props }: FieldInputProps = $props()
  const field = useFieldContext()
  const nativeInputProps: HTMLProps<'input'> = $derived({
    value,
    oninput(event) {
      value = event.currentTarget.value
    },
  })
  const mergedProps = $derived(mergeProps(field?.().getInputProps() ?? {}, nativeInputProps, props))
</script>

<UI as="input" {...mergedProps} />

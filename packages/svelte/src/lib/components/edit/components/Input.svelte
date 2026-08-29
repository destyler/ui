<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditInputBaseProps extends PolymorphicProps<'input'> {}
  export interface EditInputProps extends Assign<HTMLProps<'input'>, EditInputBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useFieldContext } from '../../field'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditInputProps = $props()

  const edit = useEditContext()
  const field = useFieldContext()
  const mergedProps = $derived(mergeProps(edit().getInputProps(), props))
</script>

<UI as="input" aria-describedby={field?.()?.ariaDescribedby} {...mergedProps} />

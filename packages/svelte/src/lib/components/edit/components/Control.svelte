<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditControlBaseProps extends PolymorphicProps<'div'> {}
  export interface EditControlProps extends Assign<HTMLProps<'div'>, EditControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditControlProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />

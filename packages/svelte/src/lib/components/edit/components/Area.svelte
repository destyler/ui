<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditAreaBaseProps extends PolymorphicProps<'div'> {}
  export interface EditAreaProps extends Assign<HTMLProps<'div'>, EditAreaBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditAreaProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getAreaProps(), props))
</script>

<UI as="div" {...mergedProps} />

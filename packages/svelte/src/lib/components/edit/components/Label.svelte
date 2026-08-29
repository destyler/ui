<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditLabelBaseProps extends PolymorphicProps<'label'> {}
  export interface EditLabelProps extends Assign<HTMLProps<'label'>, EditLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditLabelProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getLabelProps(), props))
</script>

<UI as="label" {...mergedProps} />

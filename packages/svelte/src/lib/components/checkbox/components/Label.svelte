<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CheckboxLabelBaseProps extends PolymorphicProps<'span'> {}
  export interface CheckboxLabelProps extends Assign<HTMLProps<'span'>, CheckboxLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCheckboxContext } from '../hooks/use-checkbox-context'

  const props: CheckboxLabelProps = $props()

  const checkbox = useCheckboxContext()
  const mergedProps = $derived(mergeProps(checkbox().getLabelProps(), props))
</script>

<UI as="span" {...mergedProps} />

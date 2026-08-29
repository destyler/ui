<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { UseProgressProps } from '../hooks/use-progress.svelte'

  export interface ProgressRootBaseProps extends Optional<UseProgressProps, 'id'>, PolymorphicProps<'div'> {}
  export interface ProgressRootProps extends Assign<HTMLProps<'div'>, ProgressRootBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { createSplitProps } from '../../../utils/create-split-props'
  import { UI } from '../../factory'
  import { ProgressProvider } from '../hooks/use-progress-context'
  import { useProgress } from '../hooks/use-progress.svelte'

  let { value = $bindable(), ...props }: ProgressRootProps = $props()
  const providedId = $props.id()

  const [useProgressProps, localProps] = $derived(
    createSplitProps<Optional<UseProgressProps, 'id'>>()(props, [
      'defaultValue',
      'id',
      'ids',
      'max',
      'min',
      'onValueChange',
      'orientation',
      'translations',
      'value',
    ]),
  )
  const resolvedProps = $derived<UseProgressProps>({
    ...useProgressProps,
    id: useProgressProps.id ?? providedId,
    value,
    onValueChange(details) {
      value = details.value
      useProgressProps.onValueChange?.(details)
    },
  })

  const progress = useProgress(() => resolvedProps)
  const mergedProps = $derived(mergeProps(progress().getRootProps(), localProps))

  ProgressProvider(() => progress())
</script>

<UI as="div" {...mergedProps} />

<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useToastContext } from '../hooks/use-toast-context.js'

  export interface ToastActionTriggerBaseProps extends PolymorphicProps<'button'> {}

  export interface ToastActionTriggerProps extends Assign<HTMLProps<'button'>, ToastActionTriggerBaseProps> {}

  const props: ToastActionTriggerProps = $props()

  const toast = useToastContext()
  const mergedProps = $derived(mergeProps(toast().getActionTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

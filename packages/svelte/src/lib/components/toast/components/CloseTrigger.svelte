<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useToastContext } from '../hooks/use-toast-context.js'

  export interface ToastCloseTriggerBaseProps extends PolymorphicProps<'button'> {}

  export interface ToastCloseTriggerProps extends Assign<HTMLProps<'button'>, ToastCloseTriggerBaseProps> {}

  const props: ToastCloseTriggerProps = $props()

  const toast = useToastContext()
  const mergedProps = $derived(mergeProps(toast().getCloseTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

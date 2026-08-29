<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useToastContext } from '../hooks/use-toast-context.js'

  export interface ToastDescriptionBaseProps extends PolymorphicProps<'div'> {}

  export interface ToastDescriptionProps extends Assign<HTMLProps<'div'>, ToastDescriptionBaseProps> {}

  const props: ToastDescriptionProps = $props()

  const toast = useToastContext()
  const mergedProps = $derived(mergeProps(toast().getDescriptionProps(), props))
</script>

<UI as="div" {...mergedProps} />

<script lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useToastContext } from '../hooks/use-toast-context.js'

  export interface ToastTitleBaseProps extends PolymorphicProps<'div'> {}

  export interface ToastTitleProps extends Assign<HTMLProps<'div'>, ToastTitleBaseProps> {}

  const props: ToastTitleProps = $props()

  const toast = useToastContext()
  const mergedProps = $derived(mergeProps(toast().getTitleProps(), props))
</script>

<UI as="div" {...mergedProps} />

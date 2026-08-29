<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseNumberInputReturn } from '../hooks/use-number-input.svelte'

  export interface NumberInputRootProviderBaseProps extends PolymorphicProps<'div'> {
    value: UseNumberInputReturn
  }
  export interface NumberInputRootProviderProps extends Assign<HTMLProps<'div'>, NumberInputRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { NumberInputProvider } from '../hooks/use-number-input-context'

  let { value, ...props }: NumberInputRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  NumberInputProvider(() => value())
</script>

<UI as="div" {...mergedProps} />

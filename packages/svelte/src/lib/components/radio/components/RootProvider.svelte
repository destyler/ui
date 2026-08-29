<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { UseRadioReturn } from '../hooks/use-radio.svelte'

  interface RootProviderProps {
    value: UseRadioReturn
  }

  export interface RadioRootProviderBaseProps extends RootProviderProps, PolymorphicProps<'div'> {}
  export interface RadioRootProviderProps extends Assign<HTMLProps<'div'>, RadioRootProviderBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { RadioProvider } from '../hooks/use-radio-context'

  let { value, ...props }: RadioRootProviderProps = $props()

  const mergedProps = $derived(mergeProps(value().getRootProps(), props))

  RadioProvider(() => value())
</script>

<UI as="div" {...mergedProps} />

<script module lang="ts">
  import type { ThumbProps } from '@destyler/slider'
  import type { Snippet } from 'svelte'

  export interface SliderThumbPropsProviderProps {
    value: ThumbProps
    children?: Snippet
  }
</script>

<script lang="ts">
  import { untrack } from 'svelte'
  import { SliderThumbPropsProvider } from '../hooks/use-slider-thumb-props-context'

  const { value, children }: SliderThumbPropsProviderProps = $props()
  SliderThumbPropsProvider(untrack(() => value))
</script>

{@render children?.()}

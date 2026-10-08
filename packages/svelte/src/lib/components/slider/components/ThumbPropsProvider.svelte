<script module lang="ts">
  import type { ThumbProps } from '@destyler/slider'
  import type { Snippet } from 'svelte'

  export interface SliderThumbPropsProviderProps {
    value: ThumbProps
    children?: Snippet
  }
</script>

<script lang="ts">
  import { SliderThumbPropsProvider } from '../hooks/use-slider-thumb-props-context'

  const { value, children }: SliderThumbPropsProviderProps = $props()
  SliderThumbPropsProvider({
    get index() { return value.index },
    get name() { return value.name },
  })
</script>

{@render children?.()}

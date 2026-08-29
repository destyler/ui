<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CarouselControlBaseProps extends PolymorphicProps<'div'> {}
  export interface CarouselControlProps extends Assign<HTMLProps<'div'>, CarouselControlBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselControlProps = $props()

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getControlProps(), props))
</script>

<UI as="div" {...mergedProps} />

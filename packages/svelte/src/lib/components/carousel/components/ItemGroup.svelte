<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CarouselItemGroupBaseProps extends PolymorphicProps<'div'> {}
  export interface CarouselItemGroupProps extends Assign<HTMLProps<'div'>, CarouselItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselItemGroupProps = $props()

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getItemGroupProps(), props))
</script>

<UI as="div" {...mergedProps} />

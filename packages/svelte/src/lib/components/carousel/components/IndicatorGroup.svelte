<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CarouselIndicatorGroupBaseProps extends PolymorphicProps<'div'> {}
  export interface CarouselIndicatorGroupProps extends Assign<HTMLProps<'div'>, CarouselIndicatorGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselIndicatorGroupProps = $props()

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getIndicatorGroupProps(), props))
</script>

<UI as="div" {...mergedProps} />

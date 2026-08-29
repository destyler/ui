<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { IndicatorProps } from '@destyler/carousel'

  export interface CarouselIndicatorBaseProps extends IndicatorProps, PolymorphicProps<'button'> {}
  export interface CarouselIndicatorProps extends Assign<HTMLProps<'button'>, CarouselIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselIndicatorProps = $props()
  const [indicatorProps, localProps] = $derived(createSplitProps<IndicatorProps>()(props, ['index', 'readOnly']))

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getIndicatorProps(indicatorProps), localProps))
</script>

<UI as="button" {...mergedProps} />

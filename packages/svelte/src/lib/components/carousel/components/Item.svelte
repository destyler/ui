<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'
  import type { ItemProps } from '@destyler/carousel'

  export interface CarouselItemBaseProps extends ItemProps, PolymorphicProps<'div'> {}
  export interface CarouselItemProps extends Assign<HTMLProps<'div'>, CarouselItemBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselItemProps = $props()

  const [itemProps, localProps] = $derived(createSplitProps<ItemProps>()(props, ['index', 'snapAlign']))

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getItemProps(itemProps), localProps))
</script>

<UI as="div" {...mergedProps} />

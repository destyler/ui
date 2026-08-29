<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CarouselPrevTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CarouselPrevTriggerProps extends Assign<HTMLProps<'button'>, CarouselPrevTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselPrevTriggerProps = $props()

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getPrevTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

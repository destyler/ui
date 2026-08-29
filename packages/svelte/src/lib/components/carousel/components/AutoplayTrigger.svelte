<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface CarouselAutoplayTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface CarouselAutoplayTriggerProps extends Assign<HTMLProps<'button'>, CarouselAutoplayTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useCarouselContext } from '../hooks/use-carousel-context'

  const props: CarouselAutoplayTriggerProps = $props()

  const carousel = useCarouselContext()
  const mergedProps = $derived(mergeProps(carousel().getAutoplayTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

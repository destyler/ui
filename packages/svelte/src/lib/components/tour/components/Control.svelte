<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TourControlBaseProps extends PolymorphicProps<'div'> {}
  export interface TourControlProps extends Assign<HTMLProps<'div'>, TourControlBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'
  import { tourAnatomy } from '../anatomy'

  const props: TourControlProps = $props()
</script>

<UI as="div" {...tourAnatomy.build().control.attrs} {...props} />

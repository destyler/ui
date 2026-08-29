<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface FloatingPanelDockBaseProps extends PolymorphicProps<'div'> {}
  export interface FloatingPanelDockProps extends Assign<HTMLProps<'div'>, FloatingPanelDockBaseProps> {}
</script>

<script lang="ts">
  import { UI } from '../../factory'

  const props: FloatingPanelDockProps = $props()
</script>

<UI as="div" data-scope="floating-panel" data-part="dock" {...props} />

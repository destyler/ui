<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuIndicatorProps extends Assign<HTMLProps<'div'>, MenuIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const props: MenuIndicatorProps = $props()

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getIndicatorProps(), props))
</script>

<UI as="div" {...mergedProps} />

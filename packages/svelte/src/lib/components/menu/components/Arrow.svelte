<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuArrowBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuArrowProps extends Assign<HTMLProps<'div'>, MenuArrowBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const props: MenuArrowProps = $props()

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getArrowProps(), props))
</script>

<UI as="div" {...mergedProps} />

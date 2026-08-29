<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuArrowTipBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuArrowTipProps extends Assign<HTMLProps<'div'>, MenuArrowTipBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const props: MenuArrowTipProps = $props()

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getArrowTipProps(), props))
</script>

<UI as="div" {...mergedProps} />

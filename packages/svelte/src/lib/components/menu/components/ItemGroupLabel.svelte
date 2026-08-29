<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuItemGroupLabelBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuItemGroupLabelProps extends Assign<HTMLProps<'div'>, MenuItemGroupLabelBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { useMenuItemGroupContext } from '../hooks/use-menu-item-group-context'

  const props: MenuItemGroupLabelProps = $props()

  const menu = useRequiredMenuContext()
  const itemGroup = useMenuItemGroupContext()
  const mergedProps = $derived(mergeProps(menu().getItemGroupLabelProps({ htmlFor: itemGroup().id }), props))
</script>

<UI as="div" {...mergedProps} />

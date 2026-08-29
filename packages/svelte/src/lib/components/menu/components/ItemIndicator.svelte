<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuItemIndicatorBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuItemIndicatorProps extends Assign<HTMLProps<'div'>, MenuItemIndicatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { useMenuItemPropsContext } from '../hooks/use-menu-option-item-props-context'

  const props: MenuItemIndicatorProps = $props()

  const menu = useRequiredMenuContext()
  const itemProps = useMenuItemPropsContext()
  const mergedProps = $derived(mergeProps(menu().getItemIndicatorProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />

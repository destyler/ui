<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuItemTextBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuItemTextProps extends Assign<HTMLProps<'div'>, MenuItemTextBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { useMenuItemPropsContext } from '../hooks/use-menu-option-item-props-context'

  const props: MenuItemTextProps = $props()

  const menu = useRequiredMenuContext()
  const itemProps = useMenuItemPropsContext()
  const mergedProps = $derived(mergeProps(menu().getItemTextProps(itemProps()), props))
</script>

<UI as="div" {...mergedProps} />

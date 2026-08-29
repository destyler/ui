<script module lang="ts">
  import type { Assign, HTMLProps, Optional, PolymorphicProps } from '$lib/types'
  import type { ItemGroupProps } from '@destyler/menu'

  type OptionalItemGroupProps = Optional<ItemGroupProps, 'id'>

  export interface MenuItemGroupBaseProps extends OptionalItemGroupProps, PolymorphicProps<'div'> {}
  export interface MenuItemGroupProps extends Assign<HTMLProps<'div'>, MenuItemGroupBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { MenuItemGroupProvider } from '../hooks/use-menu-item-group-context'

  const props: MenuItemGroupProps = $props()

  const menu = useRequiredMenuContext()
  const id = $props.id()
  const itemGroupProps = $derived({ id, ...props })
  const mergedProps = $derived(mergeProps(menu().getItemGroupProps(itemGroupProps), props))

  MenuItemGroupProvider(() => itemGroupProps)
</script>

<UI as="div" {...mergedProps} />

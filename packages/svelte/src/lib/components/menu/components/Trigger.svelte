<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface MenuTriggerProps extends Assign<HTMLProps<'button'>, MenuTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'
  import { useMenuTriggerItemContext } from '../hooks/use-menu-trigger-item-context'

  const props: MenuTriggerProps = $props()

  const menu = useRequiredMenuContext()
  const triggerItemProps = useMenuTriggerItemContext()

  const mergedProps = $derived(mergeProps(menu().getTriggerProps(), triggerItemProps?.() || {}, props))
</script>

<UI as="button" data-scope="menu" data-part="trigger" {...mergedProps} />

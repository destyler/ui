<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuContextTriggerBaseProps extends PolymorphicProps<'button'> {}
  export interface MenuContextTriggerProps extends Assign<HTMLProps<'button'>, MenuContextTriggerBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const props: MenuContextTriggerProps = $props()

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getContextTriggerProps(), props))
</script>

<UI as="button" {...mergedProps} />

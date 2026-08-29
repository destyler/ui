<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface MenuSeparatorBaseProps extends PolymorphicProps<'div'> {}
  export interface MenuSeparatorProps extends Assign<HTMLProps<'div'>, MenuSeparatorBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useRequiredMenuContext } from '../hooks/use-menu-context'

  const props: MenuSeparatorProps = $props()

  const menu = useRequiredMenuContext()
  const mergedProps = $derived(mergeProps(menu().getSeparatorProps(), props))
</script>

<UI as="div" data-scope="menu" data-part="separator" {...mergedProps} />

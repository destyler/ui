<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface EditPreviewBaseProps extends PolymorphicProps<'span'> {}
  export interface EditPreviewProps extends Assign<HTMLProps<'span'>, EditPreviewBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useEditContext } from '../hooks/use-edit-context'

  const props: EditPreviewProps = $props()

  const edit = useEditContext()
  const mergedProps = $derived(mergeProps(edit().getPreviewProps(), props))
</script>

<UI as="span" {...mergedProps}>
  {#if props.children}
    {@render props.children()}
  {:else}
    {edit().valueText}
  {/if}
</UI>

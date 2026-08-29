<script module lang="ts">
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types'

  export interface TreeBranchIndentGuideBaseProps extends PolymorphicProps<'div'> {}
  export interface TreeBranchIndentGuideProps
    extends Assign<HTMLProps<'div'>, TreeBranchIndentGuideBaseProps> {}
</script>

<script lang="ts">
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory'
  import { useTreeContext } from '../hooks/use-tree-context'
  import { useTreeNodePropsContext } from '../hooks/use-tree-node-props-context'

  const props: TreeBranchIndentGuideProps = $props()

  const tree = useTreeContext()
  const nodeProps = useTreeNodePropsContext()

  const mergedProps = $derived(mergeProps(tree().getBranchIndentGuideProps(nodeProps()), props))
</script>

<UI as="div" {...mergedProps} />

<script lang="ts" module>
  import type { Assign, HTMLProps, PolymorphicProps } from '$lib/types.js'
  import type { ResizeTriggerProps } from '@destyler/floating-panel'

  export interface FloatingPanelResizeTriggerBaseProps extends ResizeTriggerProps, PolymorphicProps<'div'> {}
  export interface FloatingPanelResizeTriggerProps
    extends Assign<HTMLProps<'div'>, FloatingPanelResizeTriggerBaseProps> {}
</script>

<script lang="ts">
  import { createSplitProps } from '$lib/utils/create-split-props.js'
  import { mergeProps } from '@destyler/svelte'
  import { UI } from '../../factory/index.js'
  import { useFloatingPanelContext } from '../hooks/use-floating-panel-context.js'

  let props: FloatingPanelResizeTriggerProps = $props()
  const [resizeProps, localProps] = $derived(createSplitProps<ResizeTriggerProps>()(props, ['axis']))

  const floatingPanel = useFloatingPanelContext()
  const mergedProps = $derived(mergeProps(floatingPanel().getResizeTriggerProps(resizeProps), localProps))
</script>

<UI as="div" {...mergedProps} />

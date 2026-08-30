import type { UseDynamicProps } from '../hooks/use-dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useDynamic } from '../hooks/use-dynamic'
import { DynamicProvider } from '../hooks/use-dynamic-context'

export interface DynamicRootBaseProps extends UseDynamicProps, PolymorphicProps<'div'> {}
export interface DynamicRootProps extends HTMLProps<'div'>, DynamicRootBaseProps {}

export function DynamicRoot(props: DynamicRootProps) {
  const [useDynamicProps, localProps] = createSplitProps<UseDynamicProps>()(props, [
    'addOnPaste',
    'allowOverflow',
    'autoFocus',
    'blurBehavior',
    'delimiter',
    'defaultValue',
    'disabled',
    'editable',
    'form',
    'id',
    'ids',
    'inputValue',
    'invalid',
    'max',
    'maxLength',
    'name',
    'onFocusOutside',
    'onHighlightChange',
    'onInputValueChange',
    'onInteractOutside',
    'onPointerDownOutside',
    'onValueChange',
    'onValueInvalid',
    'readOnly',
    'required',
    'translations',
    'validate',
    'value',
  ])

  const api = useDynamic(useDynamicProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <DynamicProvider value={api}>
      <ui.div {...mergedProps} />
    </DynamicProvider>
  )
}

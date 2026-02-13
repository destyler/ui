import type { UseDynamicProps } from '../hooks/use-dynamic'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useDynamic } from '../hooks/use-dynamic'
import { DynamicProvider } from '../hooks/use-dynamic-context'

export interface DynamicRootBaseProps extends UseDynamicProps, PolymorphicProps {}
export interface DynamicRootProps extends Assign<HTMLProps<'div'>, DynamicRootBaseProps> {}

export const DynamicRoot = forwardRef<HTMLDivElement, DynamicRootProps>((props, ref) => {
  const [useDynamicProps, localProps] = createSplitProps<UseDynamicProps>()(props, [
    'addOnPaste',
    'allowOverflow',
    'autoFocus',
    'blurBehavior',
    'defaultValue',
    'delimiter',
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
  const dynamic = useDynamic(useDynamicProps)
  const mergedProps = mergeProps(dynamic.getRootProps(), localProps)

  return (
    <DynamicProvider value={dynamic}>
      <ui.div {...mergedProps} ref={ref} />
    </DynamicProvider>
  )
})

DynamicRoot.displayName = 'DynamicRoot'

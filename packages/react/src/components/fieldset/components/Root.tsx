import type { UseFieldsetProps } from '../hooks/use-fieldset'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'
import { useFieldset } from '../hooks/use-fieldset'
import { FieldsetProvider } from '../hooks/use-fieldset-context'

export interface FieldsetRootBaseProps extends UseFieldsetProps, PolymorphicProps {}
export interface FieldsetRootProps extends HTMLProps<'fieldset'>, FieldsetRootBaseProps {}

export const FieldsetRoot = forwardRef<HTMLFieldSetElement, FieldsetRootProps>((props, ref) => {
  const [useFieldsetProps, localProps] = createSplitProps<UseFieldsetProps>()(props, ['id', 'disabled', 'invalid'])
  const fieldset = useFieldset(useFieldsetProps)
  const mergedProps = mergeProps<HTMLProps<'fieldset'>>(fieldset.getRootProps(), localProps)

  return (
    <FieldsetProvider value={fieldset}>
      <ui.fieldset {...mergedProps} ref={composeRefs(ref, fieldset.refs.rootRef)} />
    </FieldsetProvider>
  )
})

FieldsetRoot.displayName = 'FieldsetRoot'

import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'

export interface DynamicHiddenInputBaseProps extends PolymorphicProps<'input'> {}
export interface DynamicHiddenInputProps
  extends HTMLProps<'input'>,
  DynamicHiddenInputBaseProps {}

export function DynamicHiddenInput(props: DynamicHiddenInputProps) {
  const dynamic = useDynamicContext()
  const mergedProps = mergeProps(() => {
    const apiProps = dynamic().getHiddenInputProps()
    return { ...apiProps, readOnly: apiProps.readOnly }
  }, props)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}

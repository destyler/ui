import type { HiddenInputProps } from '@destyler/signature'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureHiddenInputBaseProps
  extends HiddenInputProps,
  PolymorphicProps<'input'> {}
export interface SignatureHiddenInputProps
  extends Assign<HTMLProps<'input'>, SignatureHiddenInputBaseProps> {}

export function SignatureHiddenInput(props: SignatureHiddenInputProps) {
  const [hiddenInputProps, localProps] = createSplitProps<HiddenInputProps>()(props, ['value'])
  const signature = useSignatureContext()
  const mergedProps = mergeProps(() => {
    const apiProps = signature().getHiddenInputProps(hiddenInputProps)
    return { ...apiProps, readOnly: apiProps.readOnly }
  }, localProps)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.().ariaDescribedby} {...mergedProps} />
}

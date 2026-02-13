import type { HiddenInputProps } from '@destyler/signature'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSignatureContext } from '../hooks/use-signature-context'

export interface SignatureHiddenInputBaseProps extends HiddenInputProps, PolymorphicProps {}
export interface SignatureHiddenInputProps extends Assign<HTMLProps<'input'>, SignatureHiddenInputBaseProps> {}

export const SignatureHiddenInput = forwardRef<HTMLInputElement, SignatureHiddenInputProps>((props, ref) => {
  const [hiddenInputProps, localProps] = createSplitProps<HiddenInputProps>()(props, ['value'])
  const signature = useSignatureContext()
  const mergedProps = mergeProps(signature.getHiddenInputProps(hiddenInputProps), localProps)
  const field = useFieldContext()

  return <ui.input aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
})

SignatureHiddenInput.displayName = 'SignatureHiddenInput'
